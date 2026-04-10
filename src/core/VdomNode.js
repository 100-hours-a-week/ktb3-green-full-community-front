export const TEXT_ELEMENT = "TEXT_ELEMENT";

export function createTextVNode(value) {
   return {
      type: TEXT_ELEMENT,
      props: { nodeValue: String(value) },
      children: [],
   };
}

export function isDomNode(value) {
   return typeof Node !== "undefined" && value instanceof Node;
}

export function isVNode(value) {
   return (
      value !== null &&
      typeof value === "object" &&
      !isDomNode(value) &&
      "type" in value &&
      Array.isArray(value.children)
   );
}

export function normalizeNode(node) {
   if (node === null || node === undefined || typeof node === "boolean") {
      return null;
   }

   if (isDomNode(node)) {
      return node;
   }

   if (isVNode(node)) {
      return {
         type: node.type,
         props: node.props ?? {},
         children: normalizeChildren(node.children),
      };
   }

   return createTextVNode(node);
}

export function normalizeChildren(children = []) {
   return children.flatMap((child) => {
      if (Array.isArray(child)) {
         return normalizeChildren(child);
      }

      const normalizedChild = normalizeNode(child);
      return normalizedChild === null ? [] : [normalizedChild];
   });
}

export default function h(type, props = {}, ...children) {
   return {
      type,
      props: props ?? {},
      children: normalizeChildren(children),
   };
}
