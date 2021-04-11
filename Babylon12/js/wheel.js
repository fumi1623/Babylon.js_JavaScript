//表示場所の確保
var canvas = document.getElementById("renderCanvas");

// エンジン生成
var engine = new BABYLON.Engine(canvas);


const createScene =  () => {
  const scene = new BABYLON.Scene(engine);

  const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 1.5, new BABYLON.Vector3(0, 0, 0));
  camera.attachControl(canvas, true);
  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0));
  
  //wheel face UVs
  const wheelUV = [];
  wheelUV[0] = new BABYLON.Vector4(0, 0, 1, 1);
  wheelUV[1] = new BABYLON.Vector4(0, 0.5, 0, 0.5);
  wheelUV[2] = new BABYLON.Vector4(0, 0, 1, 1);

  const wheelMat = new BABYLON.StandardMaterial("wheelMat");
  wheelMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/wheel.png");

  wheelRB = BABYLON.MeshBuilder.CreateCylinder("wheelRB", {diameter: 0.125, height: 0.05, faceUV: wheelUV})
  wheelRB.material = wheelMat;;

  //Animate the Wheels
  const animWheel = new BABYLON.Animation("wheelAnimation", "rotation.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

  const wheelKeys = []; 

  //At the animation key 0, the value of rotation.y is 0
  wheelKeys.push({
      frame: 0,
      value: 0
  });

  //At the animation key 30, (after 1 sec since animation fps = 30) the value of rotation.y is 2PI for a complete rotation
  wheelKeys.push({
      frame: 30,
      value: 2 * Math.PI
  });

  //set the keys
  animWheel.setKeys(wheelKeys);

  //Link this animation to a wheel
  wheelRB.animations = [];
  wheelRB.animations.push(animWheel);

  scene.beginAnimation(wheelRB, 0, 30, true);

  return scene;
}

//（定義したsceneを変数（定数でもいい）で定義）
var scene = createScene();

//定義した変数を実行する関数を定義
engine.runRenderLoop(function() {
  //表示の実行
  scene.render();
});
