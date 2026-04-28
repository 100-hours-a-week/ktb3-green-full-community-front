import createElement, { updateAttributes } from "./CreateElement.js";
import { unmountDomTree } from "./FiberRenderer.js";
import { TEXT_ELEMENT, isDomNode, isVNode } from "./VdomNode.js";

const isNil = (value) => value === null || value === undefined;

function isComponentVNode(node) {
   return (
      isVNode(node) &&
      typeof node.type === "function" &&
      typeof node.type.prototype?.template === "function"
   );
}

function isTextVNode(node) {
   return isVNode(node) && node.type === TEXT_ELEMENT;
}

function replaceNode(parent, newNode, index) {
   const currentNode = parent.childNodes[index];
   const nextDom = createElement(newNode);

   if (!currentNode) {
      parent.appendChild(nextDom);
      return;
   }

   unmountDomTree(currentNode);
   parent.replaceChild(nextDom, currentNode);
}

function updateComponentNode(parent, oldNode, newNode, index) {
   const host = parent.childNodes[index];

   if (!host || oldNode.type !== newNode.type) {
      replaceNode(parent, newNode, index);
      return;
   }

   const instance = host.__component__;
   if (!instance) {
      replaceNode(parent, newNode, index);
      return;
   }

   instance.props = {
      ...newNode.props,
      children: newNode.children,
   };
   instance.render();
}

function updateTextNode(parent, oldNode, newNode, index) {
   const target = parent.childNodes[index];
   const oldValue = oldNode.props?.nodeValue ?? "";
   const newValue = newNode.props?.nodeValue ?? "";

   if (target?.nodeType === Node.TEXT_NODE) {
      if (oldValue !== newValue) {
         target.nodeValue = newValue;
      }
      return;
   }

   replaceNode(parent, newNode, index);
}

function updateHostNode(parent, oldNode, newNode, index) {
   const target = parent.childNodes[index];

   if (!target) {
      parent.appendChild(createElement(newNode));
      return;
   }

   if (oldNode.type !== newNode.type) {
      replaceNode(parent, newNode, index);
      return;
   }

   updateAttributes(target, oldNode.props || {}, newNode.props || {});

   const oldChildren = oldNode.children || [];
   const newChildren = newNode.children || [];
   const maxLength = Math.max(oldChildren.length, newChildren.length);

   for (let childIndex = 0; childIndex < maxLength; childIndex++) {
      Diff(target, oldChildren[childIndex], newChildren[childIndex], childIndex);
   }
}

export default function Diff(parent, oldNode, newNode, index = 0) {
   if (!parent) return;

   if (!isNil(oldNode) && isNil(newNode)) {
      const target = parent.childNodes[index];
      if (target) {
         unmountDomTree(target);
         parent.removeChild(target);
      }
      return;
   }

   if (isNil(oldNode) && !isNil(newNode)) {
      parent.appendChild(createElement(newNode));
      return;
   }

   if (isDomNode(oldNode) || isDomNode(newNode)) {
      if (oldNode !== newNode) {
         replaceNode(parent, newNode, index);
      }
      return;
   }

   if (isComponentVNode(oldNode) || isComponentVNode(newNode)) {
      if (isComponentVNode(oldNode) && isComponentVNode(newNode)) {
         updateComponentNode(parent, oldNode, newNode, index);
         return;
      }

      replaceNode(parent, newNode, index);
      return;
   }

   if (isTextVNode(oldNode) || isTextVNode(newNode)) {
      if (isTextVNode(oldNode) && isTextVNode(newNode)) {
         updateTextNode(parent, oldNode, newNode, index);
         return;
      }

      replaceNode(parent, newNode, index);
      return;
   }

   if (!isVNode(oldNode) || !isVNode(newNode)) {
      replaceNode(parent, newNode, index);
      return;
   }

   updateHostNode(parent, oldNode, newNode, index);
}
