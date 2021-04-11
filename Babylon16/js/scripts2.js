//表示場所の確保
var canvas = document.getElementById("renderCanvas");

// エンジン生成
var engine = new BABYLON.Engine(canvas);

const createScene = function()  {

  var scene = new BABYLON.Scene(engine);
  var camera = new BABYLON.ArcRotateCamera("Camera", 3 * Math.PI / 2, Math.PI / 3, 50, BABYLON.Vector3.Zero(), scene);
	camera.attachControl(canvas, true);

  var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.7;

  var sphere = BABYLON.Mesh.CreateSphere("sphere1", 8, 2, scene);
  sphere.position.y = 8;

  var box = BABYLON.Mesh.CreateBox("box1", 5, scene);

  sphere.material = new BABYLON.StandardMaterial("s-mat", scene);

  scene.enablePhysics();

	sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 0, restitution: 0.9 }, scene);
	box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0.9 }, scene);

  var springJoing = new BABYLON.PhysicsJoint(BABYLON.PhysicsJoint.SpringJoint, {
    length: 8,
    stiffness: 2,
    damping: 0.1
  });
  sphere.physicsImpostor.addJoint(box.physicsImpostor, springJoing);

  box.physicsImpostor.applyImpulse(new BABYLON.Vector3(5, 0, 1), box.getAbsolutePosition());

  return scene;
}

//（定義したsceneを変数（定数でもいい）で定義）
var scene = createScene();

//定義した変数を実行する関数を定義
engine.runRenderLoop(function() {
  //表示の実行
  scene.render();
});
