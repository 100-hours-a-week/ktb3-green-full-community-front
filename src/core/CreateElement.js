import Component from "./Component.js";
import { TEXT_ELEMENT, isDomNode, isVNode } from "./VdomNode.js";

const RESERVED_PROPS = new Set(["componentName", "children"]);
const BOOLEAN_PROPS = new Set(["checked", "selected", "disabled"]);

function isComponentVNode(node) {
   return (
      isVNode(node) &&
      typeof node.type === "function" &&
      node.type.prototype instanceof Component
   );
}

function setDomProperty(target, attributeName, value) {
   if (RESERVED_PROPS.has(attributeName)) return;

   if (value === null || value === undefined || value === false) {
      target.removeAttribute(attributeName);

      if (attributeName === "value") {
         target.value = "";
      }

      if (BOOLEAN_PROPS.has(attributeName)) {
         target[attributeName] = false;
      }

      return;
   }

   if (attributeName === "value") {
      target.value = value;
      target.setAttribute(attributeName, value);
      return;
   }

   if (BOOLEAN_PROPS.has(attributeName)) {
      target[attributeName] = Boolean(value);
   }

   const normalizedValue = typeof value === "string" ? value.trim() : String(value);
   target.setAttribute(attributeName, normalizedValue);
}

export function updateAttributes(target, oldProps = {}, newProps = {}) {
   for (const attributeName of Object.keys(oldProps)) {
      if (attributeName in newProps) continue;
      setDomProperty(target, attributeName, null);
   }

   for (const [attributeName, value] of Object.entries(newProps)) {
      if (oldProps[attributeName] === value) continue;
      setDomProperty(target, attributeName, value);
   }
}

function mountComponent(node) {
   const mountPoint = document.createElement("div");
   const componentName = node.props?.componentName;

   if (componentName) {
      mountPoint.className = `${componentName}-container`;
   }

   const instance = new node.type({
      $target: mountPoint,
      ...node.props,
      children: node.children,
   });

   mountPoint.__component__ = instance;
   instance.render();

   return mountPoint;
}

function createDomNode(node) {
   if (node.type === TEXT_ELEMENT) {
      return document.createTextNode(node.props?.nodeValue ?? "");
   }

   const target = document.createElement(node.type);
   updateAttributes(target, {}, node.props || {});
   return target;
}

export default function createElement(node) {
   if (node === null || node === undefined) {
      return document.createTextNode("");
   }

   if (isDomNode(node)) {
      return node;
   }

   if (!isVNode(node)) {
      return document.createTextNode(String(node));
   }

   if (isComponentVNode(node)) {
      return mountComponent(node);
   }

   const target = createDomNode(node);
   if (node.type === TEXT_ELEMENT) {
      return target;
   }

   node.children.forEach((child) => {
      target.appendChild(createElement(child));
   });

   return target;
}
