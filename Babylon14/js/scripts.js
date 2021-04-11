//表示場所の確保
var canvas = document.getElementById("renderCanvas");

// エンジン生成
var engine = new BABYLON.Engine(canvas);

const createScene = function()  {

  const scene = new BABYLON.Scene(engine);
  //カメラの設定
  const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, new BABYLON.Vector3(0, 0, 0));
  camera.upperBetaLimit = Math.PI / 2.2;
  camera.attachControl(canvas, true);
  //ライト
  var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.7;
  //球の設置
  var sphere = BABYLON.Mesh.CreateSphere("sphere1", 4, 2, scene);
  sphere.position.y = 2;

  //地面の設置
  var ground = BABYLON.Mesh.CreateGround("ground1", 60, 60, 2, scene);

  //シーンに重力の設定
  scene.enablePhysics();

  //球にphysicsを適応
  sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.9 }, scene);
  //groundにphysicsを適応
  ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);

  scene.registerBeforeRender(function() {
    sphere.rotate(BABYLON.Axis.Z, 0.1);
    sphere.position.z -= 0.1;
  })

  return scene;
}

//（定義したsceneを変数（定数でもいい）で定義）
var scene = createScene();

//定義した変数を実行する関数を定義
engine.runRenderLoop(function() {
  //表示の実行
  scene.render();
});
