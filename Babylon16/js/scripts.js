//表示場所の確保
var canvas = document.getElementById("renderCanvas");

// エンジン生成
var engine = new BABYLON.Engine(canvas);

const createScene = function()  {

  var scene = new BABYLON.Scene(engine);
  var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 10, -20), scene);
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, true);

  var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.7;

  var sphere = BABYLON.Mesh.CreateSphere("sphere1", 8, 2, scene);
  sphere.position.y = 2;

  var ground = BABYLON.Mesh.CreateGround("ground1", 16, 16, 2, scene);

  sphere.material = new BABYLON.StandardMaterial("s-mat", scene);

  scene.enablePhysics();

	sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.9 }, scene);
	ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);

  sphere.physicsImpostor.registerOnPhysicsCollide(ground.physicsImpostor, function(main, collided){
    main.object.material.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
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
