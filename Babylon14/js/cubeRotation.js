var canvas = document.getElementById("renderCanvas");

var engine = new BABYLON.Engine(canvas);

const createScene = function() {

  var scene = new BABYLON.Scene(engine);

  var camera = new BABYLON.ArcRotateCamera("Camera", 3 * Math.PI / 2, Math.PI / 2.5, 50, BABYLON.Vector3.Zero(), scene);

  camera.attachControl(canvas, true);

  var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.7;

  var box = BABYLON.Mesh.CreateBox("box", 2, scene);
  box.position.y = 1;

  var ground = BABYLON.Mesh.CreateGround("ground1", 60, 60, 2, scene);

  scene.enablePhysics();

  box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, {mass:1, restitution:0.9}, scene);
  ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, {mass:0, restitution:0.9}, scene);

  scene.registerBeforeRender(function() {
    box.rotate(BABYLON.Axis.Z, 0.5);
    box.position.z -= 0.1;
  })

  return scene;
};

var scene = createScene();

engine.runRenderLoop(function(){
  scene.render();
});