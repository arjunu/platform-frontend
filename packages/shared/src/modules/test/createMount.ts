import { mount, ReactWrapper } from "enzyme";
import { ReactElement } from "react";

const mountedComponents: ReactWrapper[] = [];

/**
 * Makes sure that components get unmounted correctly
 */
export function createMount(node: ReactElement<{}>): ReactWrapper<any, any> {
  const mountedComponent = mount(node);
  mountedComponents.push(mountedComponent);

  return mountedComponent;
}

export function autoUnmountEnzymeComponentsHook(): void {
  mountedComponents.filter(c => c.exists()).forEach(c => c.unmount());
  mountedComponents.length = 0;
}

export function remount(component: ReactWrapper): void {
  component.unmount();
  component.mount();
}
