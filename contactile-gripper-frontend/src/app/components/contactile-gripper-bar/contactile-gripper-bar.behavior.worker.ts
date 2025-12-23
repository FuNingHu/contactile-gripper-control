import {
  registerSidebarBehavior,
  SidebarItemBehaviors,
} from "@universal-robots/contribution-api";

const behaviors: SidebarItemBehaviors = {
  factory: () => {
    return {
      type: "contactile-contactile-gripper-contactile-gripper-bar",
      version: "1.0.0",
    };
  },
};

registerSidebarBehavior(behaviors);
