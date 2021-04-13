//表示場所の確保
var canvas = document.getElementById("renderCanvas");

// エンジン生成
var engine = new BABYLON.Engine(canvas);

const createScene = function()  {

  var scene = new BABYLON.Scene(engine);

  var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 50, -100), scene);
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, true);

  var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.7;

  var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
  sphere.position.y = 10;

  var sphere2 = BABYLON.Mesh.CreateSphere("sphere2", 16, 2, scene);
  sphere2.position.x = 2;
  sphere2.position.y = -1;
  sphere2.parent = sphere;

  var ground = BABYLON.Mesh.CreateGround("ground1", 50, 50, 2, scene);

  scene.enablePhysics();

  sphere2.physicsImpostor = new BABYLON.PhysicsImpostor(sphere2, BABYLON.PhysicsImpostor.SphereImpostor, {mass:4, restitution:0.4});
  sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, {mass:2, restitution:0.4});

  ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, {mass:0, restitution:0.4, friction:0.5});

  scene.registerBeforeRender(() => {
    // move the parent
    // sphere.position.x += 0.1;
  });

  return scene;
}

//（定義したsceneを変数（定数でもいい）で定義）
var scene = createScene();

//定義した変数を実行する関数を定義
engine.runRenderLoop(function() {
  //表示の実行
  scene.render();
});
