//表示場所の確保
var canvas = document.getElementById("renderCanvas");

// エンジン生成
var engine = new BABYLON.Engine(canvas);

const createScene = function()  {

  var scene = new BABYLON.Scene(engine);

  var camera = new BABYLON.ArcRotateCamera("Camera",Math.PI / 8, Math.PI / 2.5, 50, BABYLON.Vector3.Zero(), scene);
  camera.attachControl(canvas, true);

  var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

  let holder = BABYLON.MeshBuilder.CreateSphere("holder", {diameter:2, segments:4}, scene);
  let wheel = BABYLON.MeshBuilder.CreateSphere("base", {diameterY:10, diameterZ:1, diameterX:10}, scene);

  let box1 = BABYLON.MeshBuilder.CreateBox("tooth1", {width:4, height:1, depth:3}, scene);
  box1.parent = wheel;
  box1.position.x = 5;
  let box2 = box1.clone("tooth2");
  box2.position.x = -5;
  let box3 = box1.clone("tooth3");
  box3.position.x = 0;
  box3.position.y = 5;
  box3.rotation.z = Math.PI / 2;
  box4 = box3.clone("tooth4");
  box4.position.y = -5;

  let ground1 = BABYLON.MeshBuilder.CreateGround("ground", {width: 50, height: 50}, scene);
  ground1.position.y = -3.1;
  ground1.position.x = 25;
  ground1.position.z = 25;
  ground1.rotation.z = 0.1;
  ground1.rotation.x = -0.1;

  let ground2 = BABYLON.MeshBuilder.CreateGround("ground", {width: 50, height: 50}, scene);
  ground2.position.y = -3.1;
  ground2.position.x = -25;
  ground2.position.z = 25;
  ground2.rotation.z = -0.1;
  ground2.rotation.x = -0.1;

  let ground3 = BABYLON.MeshBuilder.CreateGround("ground", {width: 50, height: 50}, scene);
  ground3.position.y = -3.1;
  ground3.position.x = 25;
  ground3.position.z = -25;
  ground3.rotation.z = 0.1;
  ground3.rotation.x = 0.1;

  let ground4 = BABYLON.MeshBuilder.CreateGround("ground", {width: 50, height: 50}, scene);
  ground4.position.y = -3.1;
  ground4.position.x = -25;
  ground4.position.z = -25;
  ground4.rotation.z = -0.1;
  ground4.rotation.x = 0.1;

  function rand() {
    let sign = Math.random() < 0.5;
    return Math.random() * (sign ? 1 : -1);
  }

  function ballPosition(ball) {
    ball.position.y = 2;
    ball.position.x = rand() * 50;
    ball.position.z = rand() * 50;
  }

  let ball = BABYLON.MeshBuilder.CreateSphere("ball", {diameter: 2, segments: 4}, scene);
  ballPosition(ball);
  let balls = [ball];
  for(let i = 0; i < 99; ++i) {
    let b = ball.clone("ball" + i);
    ballPosition(b)
    balls.push(b);
  }

  let cannon = true;
  let forceFactor = cannon ? 1 : 1500;
  scene.enablePhysics(undefined, (!cannon ? new BABYLON.OimoJSPlugin(100) : new BABYLON.CannonJSPlugin(true, 100)));

  // impostors for the blades
  [box1, box2, box3, box4].forEach((mesh) => {
    mesh.physicsImpostor = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0});
  });

  // the wheel
  wheel.physicsImpostor = new BABYLON.PhysicsImpostor(wheel, BABYLON.PhysicsImpostor.SphereImpostor, {mass: 10});
  // the center mesh that turns the wheel
  holder.physicsImpostor = new BABYLON.PhysicsImpostor(holder, BABYLON.PhysicsImpostor.SphereImpostor, {mass: 0});

  var joint1 = new BABYLON.HingeJoint({
    mainPivot: new BABYLON.Vector3(0, 0, 0),
    connectedPivot: new BABYLON.Vector3(0, 0, 0),
    mainAxis: new BABYLON.Vector3(0, 0, -1),
    connectedAxis: new BABYLON.Vector3(0, 0, -1),
    nativeParams: {
    }
  });

  // add the joint and the motor
  holder.physicsImpostor.addJoint(wheel.physicsImpostor, joint1);

  // start spinning!
  joint1.setMotor(3 * forceFactor, 20 * forceFactor);

  // impostors for the ground objects
  [ground1, ground2, ground3, ground4].forEach(ground => {
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0});
  });

  balls.forEach(ball => {
    ball.physicsImpostor = new BABYLON.PhysicsImpostor(ball, BABYLON.PhysicsImpostor.SphereImpostor, {mass: 1});
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
