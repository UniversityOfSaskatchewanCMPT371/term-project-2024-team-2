import _extends from '@babel/runtime/helpers/esm/extends';
import * as React from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Instances, Instance } from './Instances.js';

const context = /*#__PURE__*/React.createContext(null);
function useSpriteAnimator() {
  return React.useContext(context);
}
const SpriteAnimator = /* @__PURE__ */React.forwardRef(({
  startFrame,
  endFrame,
  fps,
  frameName,
  textureDataURL,
  textureImageURL,
  loop,
  numberOfFrames,
  autoPlay,
  animationNames,
  onStart,
  onEnd,
  onLoopEnd,
  onFrame,
  play,
  pause,
  flipX,
  alphaTest,
  children,
  asSprite,
  offset,
  playBackwards,
  resetOnEnd,
  maxItems,
  instanceItems,
  ...props
}, fref) => {
  const ref = React.useRef();
  const spriteData = React.useRef(null);
  //const hasEnded = React.useRef(false)
  const matRef = React.useRef();
  const spriteRef = React.useRef();
  const timerOffset = React.useRef(window.performance.now());
  const textureData = React.useRef();
  const currentFrame = React.useRef(startFrame || 0);
  const currentFrameName = React.useRef(frameName || '');
  const fpsInterval = 1000 / (fps || 30);
  const [spriteTexture, setSpriteTexture] = React.useState(new THREE.Texture());
  const totalFrames = React.useRef(0);
  const [aspect, setAspect] = React.useState([1, 1, 1]);
  const flipOffset = flipX ? -1 : 1;
  const [displayAsSprite, setDisplayAsSprite] = React.useState(asSprite !== null && asSprite !== void 0 ? asSprite : true);
  const pauseRef = React.useRef(pause);
  const pos = React.useRef(offset);
  const softEnd = React.useRef(false);
  const frameBuffer = React.useRef([]);
  //

  function reset() {}
  const state = React.useMemo(() => ({
    current: pos.current,
    offset: pos.current,
    imageUrl: textureImageURL,
    reset: reset,
    hasEnded: false,
    ref: fref
  }), [textureImageURL]);
  React.useImperativeHandle(fref, () => ref.current, []);
  React.useLayoutEffect(() => {
    pos.current = offset;
  }, [offset]);
  function loadJsonAndTextureAndExecuteCallback(jsonUrl, textureUrl, callback) {
    const textureLoader = new THREE.TextureLoader();
    const jsonPromise = fetch(jsonUrl).then(response => response.json());
    const texturePromise = new Promise(resolve => {
      textureLoader.load(textureUrl, resolve);
    });
    Promise.all([jsonPromise, texturePromise]).then(response => {
      callback(response[0], response[1]);
    });
  }
  const calculateAspectRatio = (width, height) => {
    const aspectRatio = height / width;
    if (spriteRef.current) {
      spriteRef.current.scale.set(1, aspectRatio, 1);
    }
    return [1, aspectRatio, 1];
  };

  // initial loads
  React.useEffect(() => {
    if (textureDataURL && textureImageURL) {
      loadJsonAndTextureAndExecuteCallback(textureDataURL, textureImageURL, parseSpriteData);
    } else if (textureImageURL) {
      // only load the texture, this is an image sprite only
      const textureLoader = new THREE.TextureLoader();
      new Promise(resolve => {
        textureLoader.load(textureImageURL, resolve);
      }).then(texture => {
        parseSpriteData(null, texture);
      });
    }
  }, []);
  React.useEffect(() => {
    setDisplayAsSprite(asSprite !== null && asSprite !== void 0 ? asSprite : true);
  }, [asSprite]);

  // support backwards play
  React.useEffect(() => {
    state.hasEnded = false;
    if (spriteData.current && playBackwards === true) {
      currentFrame.current = spriteData.current.frames.length - 1;
    } else {
      currentFrame.current = 0;
    }
  }, [playBackwards]);
  React.useLayoutEffect(() => {
    modifySpritePosition();
  }, [spriteTexture, flipX]);
  React.useEffect(() => {
    if (autoPlay) {
      pauseRef.current = false;
    }
  }, [autoPlay]);
  React.useEffect(() => {
    if (currentFrameName.current !== frameName && frameName) {
      currentFrame.current = 0;
      currentFrameName.current = frameName;
      state.hasEnded = false;
      modifySpritePosition();
      if (spriteData.current) {
        const {
          w,
          h
        } = getFirstItem(spriteData.current.frames).sourceSize;
        const _aspect = calculateAspectRatio(w, h);
        setAspect(_aspect);
      }
    }
  }, [frameName]);

  // parse sprite-data from JSON file (jsonHash or jsonArray)
  const parseSpriteData = (json, _spriteTexture) => {
    // sprite only case
    if (json === null) {
      if (numberOfFrames) {
        //get size from texture
        const width = _spriteTexture.image.width;
        const height = _spriteTexture.image.height;
        const frameWidth = width / numberOfFrames;
        const frameHeight = height;
        textureData.current = _spriteTexture;
        totalFrames.current = numberOfFrames;
        if (playBackwards) {
          currentFrame.current = numberOfFrames - 1;
        }
        spriteData.current = {
          frames: [],
          meta: {
            version: '1.0',
            size: {
              w: width,
              h: height
            },
            scale: '1'
          }
        };
        if (parseInt(frameWidth.toString(), 10) === frameWidth) {
          // if it fits
          for (let i = 0; i < numberOfFrames; i++) {
            spriteData.current.frames.push({
              frame: {
                x: i * frameWidth,
                y: 0,
                w: frameWidth,
                h: frameHeight
              },
              rotated: false,
              trimmed: false,
              spriteSourceSize: {
                x: 0,
                y: 0,
                w: frameWidth,
                h: frameHeight
              },
              sourceSize: {
                w: frameWidth,
                h: height
              }
            });
          }
        }
      }
    } else {
      spriteData.current = json;
      spriteData.current.frames = Array.isArray(json.frames) ? json.frames : parseFrames();
      totalFrames.current = Array.isArray(json.frames) ? json.frames.length : Object.keys(json.frames).length;
      textureData.current = _spriteTexture;
      if (playBackwards) {
        currentFrame.current = totalFrames.current - 1;
      }
      const {
        w,
        h
      } = getFirstItem(json.frames).sourceSize;
      const aspect = calculateAspectRatio(w, h);
      setAspect(aspect);
      if (matRef.current) {
        matRef.current.map = _spriteTexture;
      }
    }

    // buffer for instanced
    if (instanceItems) {
      for (var i = 0; i < instanceItems.length; i++) {
        const keys = Object.keys(spriteData.current.frames);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        frameBuffer.current.push({
          key: i,
          frames: spriteData.current.frames,
          selectedFrame: randomKey,
          offset: {
            x: 0,
            y: 0
          }
        });
      }
    }
    _spriteTexture.premultiplyAlpha = false;
    setSpriteTexture(_spriteTexture);
  };

  // for frame based JSON Hash sprite data
  const parseFrames = () => {
    const sprites = {};
    const data = spriteData.current;
    const delimiters = animationNames;
    if (delimiters) {
      for (let i = 0; i < delimiters.length; i++) {
        sprites[delimiters[i]] = [];
        for (const innerKey in data['frames']) {
          const value = data['frames'][innerKey];
          const frameData = value['frame'];
          const x = frameData['x'];
          const y = frameData['y'];
          const width = frameData['w'];
          const height = frameData['h'];
          const sourceWidth = value['sourceSize']['w'];
          const sourceHeight = value['sourceSize']['h'];
          if (innerKey.toLowerCase().indexOf(delimiters[i].toLowerCase()) !== -1) {
            sprites[delimiters[i]].push({
              x: x,
              y: y,
              w: width,
              h: height,
              frame: frameData,
              sourceSize: {
                w: sourceWidth,
                h: sourceHeight
              }
            });
          }
        }
      }
      return sprites;
    } else if (frameName) {
      const spritesArr = [];
      for (const key in data.frames) {
        spritesArr.push(data.frames[key]);
      }
      return spritesArr;
    }
  };

  // modify the sprite material after json is parsed and state updated
  const modifySpritePosition = () => {
    if (!spriteData.current) return;
    const {
      meta: {
        size: metaInfo
      },
      frames
    } = spriteData.current;
    const {
      w: frameW,
      h: frameH
    } = Array.isArray(frames) ? frames[0].sourceSize : frameName ? frames[frameName] ? frames[frameName][0].sourceSize : {
      w: 0,
      h: 0
    } : {
      w: 0,
      h: 0
    };
    matRef.current.map.wrapS = matRef.current.map.wrapT = THREE.RepeatWrapping;
    matRef.current.map.center.set(0, 0);
    matRef.current.map.repeat.set(1 * flipOffset / (metaInfo.w / frameW), 1 / (metaInfo.h / frameH));

    //const framesH = (metaInfo.w - 1) / frameW
    const framesV = (metaInfo.h - 1) / frameH;
    const frameOffsetY = 1 / framesV;
    matRef.current.map.offset.x = 0.0; //-matRef.current.map.repeat.x
    matRef.current.map.offset.y = 1 - frameOffsetY;
    if (onStart) onStart({
      currentFrameName: frameName,
      currentFrame: currentFrame.current
    });
  };

  // run the animation on each frame
  const runAnimation = () => {
    //if (!frameName) return
    const now = window.performance.now();
    const diff = now - timerOffset.current;
    const {
      meta: {
        size: metaInfo
      },
      frames
    } = spriteData.current;
    const {
      w: frameW,
      h: frameH
    } = getFirstItem(frames).sourceSize;
    const spriteFrames = Array.isArray(frames) ? frames : frameName ? frames[frameName] : [];
    const _endFrame = endFrame || spriteFrames.length - 1;
    var _offset = offset === undefined ? state.current : offset;

    // conditionals to support backwards play
    var endCondition = playBackwards ? currentFrame.current < 0 : currentFrame.current > _endFrame;
    var onStartCondition = playBackwards ? currentFrame.current === _endFrame : currentFrame.current === 0;
    var manualProgressEndCondition = playBackwards ? currentFrame.current < 0 : currentFrame.current >= _endFrame;
    if (endCondition) {
      currentFrame.current = loop ? startFrame !== null && startFrame !== void 0 ? startFrame : 0 : 0;
      if (playBackwards) {
        currentFrame.current = _endFrame;
      }
      if (loop) {
        onLoopEnd == null || onLoopEnd({
          currentFrameName: frameName,
          currentFrame: currentFrame.current
        });
      } else {
        onEnd == null || onEnd({
          currentFrameName: frameName,
          currentFrame: currentFrame.current
        });
        if (!_offset) {
          console.log('will end');
        }
        state.hasEnded = resetOnEnd ? false : true;
        if (resetOnEnd) {
          pauseRef.current = true;
          //calculateFinalPosition(frameW, frameH, metaInfo, spriteFrames)
        }
      }

      if (!loop) return;
    } else if (onStartCondition) {
      onStart == null || onStart({
        currentFrameName: frameName,
        currentFrame: currentFrame.current
      });
    }

    // for manual update
    if (_offset !== undefined && manualProgressEndCondition) {
      if (softEnd.current === false) {
        onEnd == null || onEnd({
          currentFrameName: frameName,
          currentFrame: currentFrame.current
        });
        softEnd.current = true;
      }
    } else {
      // same for start?
      softEnd.current = false;
    }

    // clock to limit fps
    if (diff <= fpsInterval) return;
    timerOffset.current = now - diff % fpsInterval;
    calculateFinalPosition(frameW, frameH, metaInfo, spriteFrames);
  };
  const calculateFinalPosition = (frameW, frameH, metaInfo, spriteFrames) => {
    // get the manual update offset to find the next frame
    var _offset = offset === undefined ? state.current : offset;
    const targetFrame = currentFrame.current;
    let finalValX = 0;
    let finalValY = 0;
    calculateAspectRatio(frameW, frameH);
    const framesH = (metaInfo.w - 1) / frameW;
    const framesV = (metaInfo.h - 1) / frameH;
    if (!spriteFrames[targetFrame]) {
      return;
    }
    const {
      frame: {
        x: frameX,
        y: frameY
      },
      sourceSize: {
        w: originalSizeX,
        h: originalSizeY
      }
    } = spriteFrames[targetFrame];
    const frameOffsetX = 1 / framesH;
    const frameOffsetY = 1 / framesV;
    finalValX = flipOffset > 0 ? frameOffsetX * (frameX / originalSizeX) : frameOffsetX * (frameX / originalSizeX) - matRef.current.map.repeat.x;
    finalValY = Math.abs(1 - frameOffsetY) - frameOffsetY * (frameY / originalSizeY);
    matRef.current.map.offset.x = finalValX;
    matRef.current.map.offset.y = finalValY;

    // if manual update is active
    if (_offset !== undefined && _offset !== null) {
      // Calculate the frame index, based on offset given from the provider
      let frameIndex = Math.floor(_offset * spriteFrames.length);

      // Ensure the frame index is within the valid range
      frameIndex = Math.max(0, Math.min(frameIndex, spriteFrames.length - 1));
      if (isNaN(frameIndex)) {
        console.log('nan frame detected');
        frameIndex = 0; //fallback
      }

      currentFrame.current = frameIndex;
    } else {
      // auto update
      if (playBackwards) {
        currentFrame.current -= 1;
      } else {
        currentFrame.current += 1;
      }
    }
  };

  // *** Warning! It runs on every frame! ***
  useFrame((_state, _delta) => {
    var _spriteData$current, _matRef$current;
    if (!((_spriteData$current = spriteData.current) != null && _spriteData$current.frames) || !((_matRef$current = matRef.current) != null && _matRef$current.map)) {
      return;
    }
    if (pauseRef.current) {
      return;
    }
    if (!state.hasEnded && (autoPlay || play)) {
      runAnimation();
      onFrame && onFrame({
        currentFrameName: currentFrameName.current,
        currentFrame: currentFrame.current
      });
    }
  });

  // utils
  const getFirstItem = param => {
    if (Array.isArray(param)) {
      return param[0];
    } else if (typeof param === 'object' && param !== null) {
      const keys = Object.keys(param);
      return frameName ? param[frameName][0] : param[keys[0]][0];
    } else {
      return {
        w: 0,
        h: 0
      };
    }
  };
  return /*#__PURE__*/React.createElement("group", _extends({}, props, {
    ref: ref
  }), /*#__PURE__*/React.createElement(context.Provider, {
    value: state
  }, /*#__PURE__*/React.createElement(React.Suspense, {
    fallback: null
  }, displayAsSprite && /*#__PURE__*/React.createElement("sprite", {
    ref: spriteRef,
    scale: aspect
  }, /*#__PURE__*/React.createElement("spriteMaterial", {
    toneMapped: false,
    ref: matRef,
    map: spriteTexture,
    transparent: true,
    alphaTest: alphaTest !== null && alphaTest !== void 0 ? alphaTest : 0.0
  })), !displayAsSprite && /*#__PURE__*/React.createElement(Instances, {
    limit: maxItems // Optional: max amount of items (for calculating buffer size)
  }, /*#__PURE__*/React.createElement("planeGeometry", {
    args: [1, 1]
  }), /*#__PURE__*/React.createElement("meshBasicMaterial", {
    toneMapped: false,
    side: THREE.DoubleSide,
    ref: matRef,
    map: spriteTexture,
    transparent: true,
    alphaTest: alphaTest !== null && alphaTest !== void 0 ? alphaTest : 0.0
  }), (instanceItems !== null && instanceItems !== void 0 ? instanceItems : [0]).map((item, index) => {
    const texture = spriteTexture.clone();
    if (matRef.current && frameBuffer.current[index]) {
      texture.offset.set(frameBuffer.current[index].offset.x, frameBuffer.current[index].offset.y); // Set the offset for this item
    }

    return /*#__PURE__*/React.createElement(Instance, {
      key: index,
      ref: spriteRef,
      position: item,
      scale: aspect
    }, /*#__PURE__*/React.createElement("meshBasicMaterial", {
      toneMapped: false,
      side: THREE.DoubleSide,
      map: texture,
      transparent: true,
      alphaTest: alphaTest !== null && alphaTest !== void 0 ? alphaTest : 0.0
    }));
  }))), children));
});

export { SpriteAnimator, useSpriteAnimator };
