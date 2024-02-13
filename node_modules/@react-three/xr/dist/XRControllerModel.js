import { Group, Mesh, SphereGeometry, MeshBasicMaterial } from "three";
import { MotionControllerConstants } from "three-stdlib";
const isEnvMapApplicable = (material) => "envMap" in material;
const updateEnvMap = (material, envMap) => {
  material.envMap = envMap;
  material.needsUpdate = true;
};
const applyEnvironmentMap = (envMap, obj) => {
  if (obj instanceof Mesh) {
    if (Array.isArray(obj.material)) {
      obj.material.forEach((m) => isEnvMapApplicable(m) ? updateEnvMap(m, envMap) : void 0);
    } else if (isEnvMapApplicable(obj.material)) {
      updateEnvMap(obj.material, envMap);
    }
  }
};
const isEnvMapIntensityApplicable = (material) => "envMapIntensity" in material;
const updateEnvMapIntensity = (material, envMapIntensity) => {
  material.envMapIntensity = envMapIntensity;
  material.needsUpdate = true;
};
const applyEnvironmentMapIntensity = (envMapIntensity, obj) => {
  if (obj instanceof Mesh) {
    if (Array.isArray(obj.material)) {
      obj.material.forEach((m) => isEnvMapIntensityApplicable(m) ? updateEnvMapIntensity(m, envMapIntensity) : void 0);
    } else if (isEnvMapIntensityApplicable(obj.material)) {
      updateEnvMapIntensity(obj.material, envMapIntensity);
    }
  }
};
function findNodes(motionController, scene) {
  Object.values(motionController.components).forEach((component) => {
    const { type, touchPointNodeName, visualResponses } = component;
    if (type === MotionControllerConstants.ComponentType.TOUCHPAD && touchPointNodeName) {
      component.touchPointNode = scene.getObjectByName(touchPointNodeName);
      if (component.touchPointNode) {
        const sphereGeometry = new SphereGeometry(1e-3);
        const material = new MeshBasicMaterial({ color: 255 });
        const sphere = new Mesh(sphereGeometry, material);
        component.touchPointNode.add(sphere);
      } else {
        console.warn(`Could not find touch dot, ${component.touchPointNodeName}, in touchpad component ${component.id}`);
      }
    }
    Object.values(visualResponses).forEach((visualResponse) => {
      const { valueNodeName, minNodeName, maxNodeName, valueNodeProperty } = visualResponse;
      if (valueNodeProperty === MotionControllerConstants.VisualResponseProperty.TRANSFORM && minNodeName && maxNodeName) {
        visualResponse.minNode = scene.getObjectByName(minNodeName);
        visualResponse.maxNode = scene.getObjectByName(maxNodeName);
        if (!visualResponse.minNode) {
          console.warn(`Could not find ${minNodeName} in the model`);
          return;
        }
        if (!visualResponse.maxNode) {
          console.warn(`Could not find ${maxNodeName} in the model`);
          return;
        }
      }
      visualResponse.valueNode = scene.getObjectByName(valueNodeName);
      if (!visualResponse.valueNode) {
        console.warn(`Could not find ${valueNodeName} in the model`);
      }
    });
  });
}
function addAssetSceneToControllerModel(controllerModel, scene) {
  findNodes(controllerModel.motionController, scene);
  if (controllerModel.envMap || controllerModel.envMapIntensity != null) {
    scene.traverse((c) => {
      if (controllerModel.envMap)
        applyEnvironmentMap(controllerModel.envMap, c);
      if (controllerModel.envMapIntensity != null)
        applyEnvironmentMapIntensity(controllerModel.envMapIntensity, c);
    });
  }
  controllerModel.add(scene);
}
class XRControllerModel extends Group {
  constructor() {
    super();
    this.motionController = null;
    this.envMap = null;
    this.envMapIntensity = 1;
    this.scene = null;
  }
  setEnvironmentMap(envMap, envMapIntensity = 1) {
    var _a;
    if (this.envMap === envMap && this.envMapIntensity === envMapIntensity) {
      return this;
    }
    this.envMap = envMap;
    this.envMapIntensity = envMapIntensity;
    (_a = this.scene) == null ? void 0 : _a.traverse((c) => {
      applyEnvironmentMap(envMap, c);
      applyEnvironmentMapIntensity(envMapIntensity, c);
    });
    return this;
  }
  setEnvironmentMapIntensity(envMapIntensity) {
    var _a;
    if (this.envMapIntensity === envMapIntensity) {
      return this;
    }
    this.envMapIntensity = envMapIntensity;
    (_a = this.scene) == null ? void 0 : _a.traverse((c) => applyEnvironmentMapIntensity(envMapIntensity, c));
    return this;
  }
  connectModel(scene) {
    if (!this.motionController) {
      console.warn("scene tried to add, but no motion controller");
      return;
    }
    this.scene = scene;
    addAssetSceneToControllerModel(this, scene);
    this.dispatchEvent({
      type: "modelconnected",
      data: scene
    });
  }
  connectMotionController(motionController) {
    this.motionController = motionController;
    this.dispatchEvent({
      type: "motionconnected",
      data: motionController
    });
  }
  updateMatrixWorld(force) {
    super.updateMatrixWorld(force);
    if (!this.motionController)
      return;
    this.motionController.updateFromGamepad();
    Object.values(this.motionController.components).forEach((component) => {
      Object.values(component.visualResponses).forEach((visualResponse) => {
        const { valueNode, minNode, maxNode, value, valueNodeProperty } = visualResponse;
        if (!valueNode)
          return;
        if (valueNodeProperty === MotionControllerConstants.VisualResponseProperty.VISIBILITY && typeof value === "boolean") {
          valueNode.visible = value;
        } else if (valueNodeProperty === MotionControllerConstants.VisualResponseProperty.TRANSFORM && minNode && maxNode && typeof value === "number") {
          valueNode.quaternion.slerpQuaternions(minNode.quaternion, maxNode.quaternion, value);
          valueNode.position.lerpVectors(minNode.position, maxNode.position, value);
        }
      });
    });
  }
  disconnect() {
    this.dispatchEvent({
      type: "motiondisconnected",
      data: this.motionController
    });
    this.dispatchEvent({
      type: "modeldisconnected",
      data: this.scene
    });
    this.motionController = null;
    if (this.scene) {
      this.remove(this.scene);
    }
    this.scene = null;
  }
  dispose() {
    this.disconnect();
  }
}
export {
  XRControllerModel
};
//# sourceMappingURL=XRControllerModel.js.map
