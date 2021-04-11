//表示場所の確保
var canvas = document.getElementById("renderCanvas");

// エンジン生成
var engine = new BABYLON.Engine(canvas);


//表示の中身（sceneの定義）
const createScene = function() {
  const scene = new BABYLON.Scene(engine);

  /**** Set camera and light *****/
  const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, new BABYLON.Vector3(0, 0, 0));
  camera.upperBetaLimit = Math.PI / 2.2;
  camera.attachControl(canvas, true);
  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(4, 1, 0));

  buildFountain();

  return scene;
}

const buildFountain = function() {

  const fountainProfile = [
    new BABYLON.Vector3(0, 0, 0),
		new BABYLON.Vector3(10, 0, 0),
    new BABYLON.Vector3(10, 4, 0),
		new BABYLON.Vector3(8, 4, 0),
    new BABYLON.Vector3(8, 1, 0),
    new BABYLON.Vector3(1, 2, 0),
		new BABYLON.Vector3(1, 15, 0),
		new BABYLON.Vector3(3, 17, 0)
  ];

  const fountain = BABYLON.MeshBuilder.CreateLathe("fountain", {shape: fountainProfile, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);
  fountain.position.y = -5;

  var particleSystem = new BABYLON.ParticleSystem("particles", 5000, scene);

  particleSystem.particleTexture = new BABYLON.Texture("textures/flare.png", scene);

  particleSystem.emitter = new BABYLON.Vector3(0, 10, 0);
  particleSystem.minEmitBox = new BABYLON.Vector3(-1, 0, 0);
  particleSystem.maxEmitBox = new BABYLON.Vector3(1, 10, 0);
  //色
  particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
  particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
  particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);
  //サイズ
  particleSystem.minSize = 0.1;
  particleSystem.maxSize = 0.5;
  //時間
  particleSystem.minLifeTime = 2;
  particleSystem.maxLifeTime = 3.5;
  //放出設定
  particleSystem.emitRate = 1500;

  //gravityないと落ちてこない（これはこれで面白い）
  particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
  particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

  //左右に出て行くように
  particleSystem.direction1 = new BABYLON.Vector3(-2, 8, 2);
  particleSystem.direction2 = new BABYLON.Vector3(2, 8, -2);

  particleSystem.minAngularSpeed = 0;
  particleSystem.maxAngularSpeed = Math.PI;

  particleSystem.minEmitPower = 1;
  particleSystem.maxEmitPower = 3;
  particleSystem.updateSpeed = 0.025;

  particleSystem.start();

}

//（定義したsceneを変数（定数でもいい）で定義）
var scene = createScene();

//定義した変数を実行する関数を定義
engine.runRenderLoop(function() {
  //表示の実行
  scene.render();
});

