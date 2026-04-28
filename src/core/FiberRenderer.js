import {
   createComponentMountPoint,
   createDomNodeFromVNode,
   isComponentType,
   updateAttributes,
   updateComponentMountPoint,
} from "./CreateElement.js";
import { TEXT_ELEMENT, isDomNode, isVNode, normalizeNode } from "./VdomNode.js";

const ROOT_TYPE = "ROOT";
const EFFECT_PLACEMENT = "PLACEMENT";
const EFFECT_UPDATE = "UPDATE";
const EFFECT_DELETION = "DELETION";

const currentRoots = new WeakMap();
const pendingRoots = [];

let workInProgressRoot = null;
let nextUnitOfWork = null;
let deletions = [];
let workLoopScheduled = false;

const scheduleIdleCallback =
   typeof requestIdleCallback === "function"
      ? requestIdleCallback
      : (callback) =>
           setTimeout(() => {
              callback({ timeRemaining: () => 999 });
           }, 1);

function createRootFiber(container, owner, vnode) {
   return {
      kind: ROOT_TYPE,
      type: ROOT_TYPE,
      dom: container,
      props: { children: vnode ? [vnode] : [] },
      children: vnode ? [vnode] : [],
      child: null,
      sibling: null,
      return: null,
      alternate: currentRoots.get(container) ?? null,
      effectTag: null,
      stateNode: owner,
      rootOwner: owner,
   };
}

function ensureWorkLoop() {
   if (workLoopScheduled) return;

   workLoopScheduled = true;
   scheduleIdleCallback(workLoop);
}

function enqueueRoot(root) {
   const pendingIndex = pendingRoots.findIndex((pendingRoot) => pendingRoot.dom === root.dom);
   if (pendingIndex >= 0) {
      pendingRoots[pendingIndex] = root;
   } else {
      pendingRoots.push(root);
   }

   if (workInProgressRoot?.dom === root.dom) {
      workInProgressRoot = root;
      nextUnitOfWork = root;
      deletions = [];
   }
}

function pullNextRoot() {
   if (workInProgressRoot || pendingRoots.length === 0) return;

   workInProgressRoot = pendingRoots.shift();
   nextUnitOfWork = workInProgressRoot;
   deletions = [];
}

function workLoop(deadline) {
   pullNextRoot();

   while (workInProgressRoot && nextUnitOfWork && deadline.timeRemaining() > 1) {
      nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
   }

   if (workInProgressRoot && !nextUnitOfWork) {
      commitRoot();
   }

   if (workInProgressRoot || pendingRoots.length > 0) {
      scheduleIdleCallback(workLoop);
      return;
   }

   workLoopScheduled = false;
}

function getNodeKind(node) {
   if (isDomNode(node)) return "RAW";
   if (!isVNode(node)) return "TEXT";
   if (node.type === TEXT_ELEMENT) return "TEXT";
   if (isComponentType(node.type)) return "COMPONENT";
   return "HOST";
}

function normalizeElementRecord(element) {
   const normalized = normalizeNode(element);
   const kind = getNodeKind(normalized);

   if (kind === "RAW") {
      return {
         kind,
         type: "RAW",
         props: {},
         children: [],
         node: normalized,
      };
   }

   if (kind === "TEXT") {
      if (isVNode(normalized)) {
         return {
            kind,
            type: TEXT_ELEMENT,
            props: normalized.props ?? {},
            children: [],
            node: normalized,
         };
      }

      return {
         kind,
         type: TEXT_ELEMENT,
         props: { nodeValue: String(normalized ?? "") },
         children: [],
         node: normalized,
      };
   }

   return {
      kind,
      type: normalized.type,
      props: normalized.props ?? {},
      children: normalized.children ?? [],
      node: normalized,
   };
}

function getClosestParentDom(fiber) {
   let parentFiber = fiber;

   while (parentFiber && !parentFiber.dom) {
      parentFiber = parentFiber.return;
   }

   return parentFiber?.dom ?? null;
}

function isSameType(elementRecord, oldFiber) {
   if (!oldFiber || !elementRecord) return false;
   if (oldFiber.kind !== elementRecord.kind) return false;

   switch (elementRecord.kind) {
      case "RAW":
         return oldFiber.node === elementRecord.node;
      case "TEXT":
      case "HOST":
      case "COMPONENT":
         return oldFiber.type === elementRecord.type;
      default:
         return false;
   }
}

function createFiber(elementRecord, returnFiber, oldFiber) {
   const sameType = isSameType(elementRecord, oldFiber);

   if (!elementRecord) return null;

   return {
      kind: elementRecord.kind,
      type: elementRecord.type,
      props: elementRecord.props,
      children: elementRecord.children,
      node: elementRecord.node,
      dom: sameType ? oldFiber.dom : null,
      stateNode: sameType ? oldFiber.stateNode : null,
      child: null,
      sibling: null,
      return: returnFiber,
      alternate: sameType ? oldFiber : null,
      effectTag: sameType ? EFFECT_UPDATE : EFFECT_PLACEMENT,
   };
}

function reconcileChildren(returnFiber, elements = [], previousChild = returnFiber.alternate?.child ?? null) {
   let index = 0;
   let oldFiber = previousChild;
   let previousSibling = null;

   while (index < elements.length || oldFiber) {
      const elementRecord = index < elements.length ? normalizeElementRecord(elements[index]) : null;
      const newFiber = createFiber(elementRecord, returnFiber, oldFiber);

      if (oldFiber && !isSameType(elementRecord, oldFiber)) {
         oldFiber.effectTag = EFFECT_DELETION;
         deletions.push({
            fiber: oldFiber,
            parentDom: getClosestParentDom(returnFiber),
         });
      }

      if (oldFiber) {
         oldFiber = oldFiber.sibling;
      }

      if (newFiber) {
         if (index === 0) {
            returnFiber.child = newFiber;
         } else if (previousSibling) {
            previousSibling.sibling = newFiber;
         }

         previousSibling = newFiber;
      }

      index += 1;
   }
}

function updateRootFiber(fiber) {
   reconcileChildren(fiber, fiber.props.children || []);
}

function updateHostFiber(fiber) {
   if (!fiber.dom) {
      fiber.dom = createDomNodeFromVNode({
         type: fiber.type,
         props: fiber.props,
         children: [],
      });
   }

   reconcileChildren(fiber, fiber.children || []);
}

function updateTextFiber(fiber) {
   if (!fiber.dom) {
      fiber.dom = createDomNodeFromVNode({
         type: TEXT_ELEMENT,
         props: fiber.props,
         children: [],
      });
   }
}

function updateRawFiber(fiber) {
   fiber.dom = fiber.node;
}

function updateComponentFiber(fiber) {
   const mountPoint = fiber.dom ?? createComponentMountPoint(fiber.props);
   const latestRoot = currentRoots.get(mountPoint);
   const componentProps = {
      ...fiber.props,
      $target: mountPoint,
      children: fiber.children,
   };

   let instance = fiber.stateNode;
   if (!instance) {
      instance = new fiber.type(componentProps);
   } else {
      instance.props = componentProps;
      instance.$target = mountPoint;
      instance._unmounted = false;
   }

   fiber.dom = mountPoint;
   fiber.stateNode = instance;
   mountPoint.__component__ = instance;

   updateComponentMountPoint(mountPoint, fiber.alternate?.props || {}, fiber.props || {});

   const childNode = normalizeNode(instance.template());
   instance.oldVdom = childNode;

   reconcileChildren(fiber, childNode ? [childNode] : [], latestRoot?.child ?? fiber.alternate?.child ?? null);
}

function performUnitOfWork(fiber) {
   switch (fiber.kind) {
      case ROOT_TYPE:
         updateRootFiber(fiber);
         break;
      case "COMPONENT":
         updateComponentFiber(fiber);
         break;
      case "HOST":
         updateHostFiber(fiber);
         break;
      case "TEXT":
         updateTextFiber(fiber);
         break;
      case "RAW":
         updateRawFiber(fiber);
         break;
   }

   if (fiber.child) return fiber.child;

   let nextFiber = fiber;
   while (nextFiber) {
      if (nextFiber.sibling) return nextFiber.sibling;
      nextFiber = nextFiber.return;
   }

   return null;
}

function getHostParentDom(fiber) {
   let parentFiber = fiber.return;

   while (parentFiber && !parentFiber.dom) {
      parentFiber = parentFiber.return;
   }

   return parentFiber?.dom ?? null;
}

function getHostSibling(fiber, parentDom) {
   let node = fiber;

   findSibling: while (node) {
      while (!node.sibling) {
         node = node.return;
         if (!node || node.kind === ROOT_TYPE) {
            return null;
         }
      }

      node = node.sibling;

      while (node && !node.dom) {
         if (node.child) {
            node = node.child;
            continue;
         }
         continue findSibling;
      }

      if (node.effectTag !== EFFECT_PLACEMENT && node.dom?.parentNode === parentDom) {
         return node.dom;
      }
   }

   return null;
}

function commitPlacement(fiber, parentDom) {
   if (!parentDom || !fiber.dom) return;

   const beforeNode = getHostSibling(fiber, parentDom);
   if (beforeNode) {
      parentDom.insertBefore(fiber.dom, beforeNode);
      return;
   }

   parentDom.appendChild(fiber.dom);
}

function commitUpdate(fiber) {
   if (!fiber.alternate || !fiber.dom) return;

   if (fiber.kind === "HOST") {
      updateAttributes(fiber.dom, fiber.alternate.props || {}, fiber.props || {});
      return;
   }

   if (fiber.kind === "TEXT") {
      const oldValue = fiber.alternate.props?.nodeValue ?? "";
      const newValue = fiber.props?.nodeValue ?? "";

      if (oldValue !== newValue) {
         fiber.dom.nodeValue = newValue;
      }
      return;
   }

   if (fiber.kind === "COMPONENT") {
      updateComponentMountPoint(fiber.dom, fiber.alternate.props || {}, fiber.props || {});
   }
}

export function unmountDomTree(node) {
   if (!node || !isDomNode(node)) return;

   Array.from(node.childNodes || []).forEach((childNode) => {
      unmountDomTree(childNode);
   });

   const instance = node.__component__;
   if (!instance || typeof instance.unmount !== "function") return;

   instance.unmount({ skipChildren: true });
}

function commitDeletion(fiber, parentDom) {
   if (!fiber) return;

   if (fiber.dom) {
      unmountDomTree(fiber.dom);
      if (parentDom?.contains(fiber.dom)) {
         parentDom.removeChild(fiber.dom);
      }
      return;
   }

   commitDeletion(fiber.child, parentDom);
}

function commitWork(fiber) {
   if (!fiber) return;

   const parentDom = getHostParentDom(fiber);

   if (fiber.effectTag === EFFECT_PLACEMENT) {
      commitPlacement(fiber, parentDom);
   } else if (fiber.effectTag === EFFECT_UPDATE) {
      commitUpdate(fiber);
   }

   commitWork(fiber.child);

   if (fiber.kind === "COMPONENT") {
      fiber.stateNode?.runPostRender?.();
      currentRoots.set(fiber.dom, {
         kind: ROOT_TYPE,
         type: ROOT_TYPE,
         dom: fiber.dom,
         props: { children: fiber.stateNode?.oldVdom ? [fiber.stateNode.oldVdom] : [] },
         children: fiber.stateNode?.oldVdom ? [fiber.stateNode.oldVdom] : [],
         child: fiber.child,
         sibling: null,
         return: null,
         alternate: null,
         effectTag: null,
         stateNode: fiber.stateNode,
         rootOwner: fiber.stateNode,
      });
   }

   commitWork(fiber.sibling);
}

function commitRoot() {
   deletions.forEach(({ fiber, parentDom }) => {
      commitDeletion(fiber, parentDom);
   });

   commitWork(workInProgressRoot.child);
   currentRoots.set(workInProgressRoot.dom, workInProgressRoot);
   workInProgressRoot.rootOwner?.runPostRender?.();

   workInProgressRoot = null;
   nextUnitOfWork = null;
   deletions = [];
}

export function scheduleUpdate(component, vnode) {
   if (!component?.$target) return;

   const root = createRootFiber(component.$target, component, vnode);
   enqueueRoot(root);
   ensureWorkLoop();
}

export function clearRoot(container) {
   if (!container) return;

   currentRoots.delete(container);

   const pendingIndex = pendingRoots.findIndex((root) => root.dom === container);
   if (pendingIndex >= 0) {
      pendingRoots.splice(pendingIndex, 1);
   }

   if (workInProgressRoot?.dom === container) {
      workInProgressRoot = null;
      nextUnitOfWork = null;
      deletions = [];
   }
}
