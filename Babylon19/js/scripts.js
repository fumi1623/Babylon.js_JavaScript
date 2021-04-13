//表示場所の確保
var canvas = document.getElementById("renderCanvas");

// エンジン生成
var engine = new BABYLON.Engine(canvas);

const createScene = function()  {

  const scene = new BABYLON.Scene(engine);

  const camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", -Math.PI / 2, Math.PI / 2.2, 10, new BABYLON.Vector3(0, 0, 0), scene);
  camera.attachControl(canvas, true);
  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

  const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 25, height: 25});
  ground.material = new BABYLON.GridMaterial("groundMat", scene);
  ground.material.backFaceCulling = false;

  const particleSystem = new BABYLON.ParticleSystem("particles", 2000);
  particleSystem.particleTexture = new BABYLON.Texture("texture/flare.png");
  //パーティクルが放出される位置
  particleSystem.emitter = new BABYLON.Vector3(0, 0.5, 0);

  particleSystem.start();

  return scene;
}

//（定義したsceneを変数（定数でもいい）で定義）
var scene = createScene();

//定義した変数を実行する関数を定義
engine.runRenderLoop(function() {
  //表示の実行
  scene.render();
});
