//表示場所の確保
var canvas = document.getElementById("renderCanvas");

// エンジン生成
var engine = new BABYLON.Engine(canvas);

const createScene = function()  {

  var scene = new BABYLON.Scene(engine);
  //setup camera
  var camera = new BABYLON.ArcRotateCamera("Camera", BABYLON.Tools.ToRadians(-120), BABYLON.Tools.ToRadians(80), 65, new BABYLON.Vector3(0, -15, 0), scene);
  camera.attachControl(canvas, false);

  //setup lights
  var light1 = new BABYLON.PointLight("light1", new BABYLON.Vector3(0, 5,-6), scene);
  var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(6, 5, 3.5), scene);
  var light3 = new BABYLON.DirectionalLight("light3", new BABYLON.Vector3(20, -5, 20), scene);
  light1.intensity = 15;
  light2.intensity = 5;

  //environment
  var hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("/texture/environment.dds", scene);
  hdrTexture.name = "envTex";
  hdrTexture.gammaSpace = false;
  scene.environmentTexture = hdrTexture;

  var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
  var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("texture/skybox", scene);
  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  skybox.material = skyboxMaterial;

  let cannon = true;
  let forceFactor = cannon ? 1 : 1500;
  scene.enablePhysics(undefined, (!cannon ? new BABYLON.OimoJSPlugin(100) : new BABYLON.CannonJSPlugin(true, 100)));

  setInterval(function(){
    var sphere = BABYLON.Mesh.CreateSphere("sphere1", 4, 2, scene);
    sphere.position.y = 10;
    sphere.material = new BABYLON.StandardMaterial("s-mat", scene);
    sphere.material.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
    //球にphysicsを適応
    sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.9 }, scene);
  }, 3000);



  var holder = BABYLON.MeshBuilder.CreateSphere("holder", {diameter: 2, segments: 4}, scene);
  var holderMat = new BABYLON.StandardMaterial("holderMat");
  holderMat.diffuseTexture = new BABYLON.Texture("texture/albedo.png");
  holder.material = holderMat;
	var wheel = BABYLON.MeshBuilder.CreateSphere("wheel", {diameterY: 10, diameterZ: 1, diameterX: 10}, scene);
  var wheelMat = new BABYLON.StandardMaterial("wheelMat");
  wheelMat.diffuseTexture = new BABYLON.Texture("texture/albedo.png");
  wheel.material = wheelMat;
  var box1 = BABYLON.MeshBuilder.CreateBox("tooth1", {width: 4, height:1, depth:3}, scene);
  box1.parent = wheel;
  box1.position.x = 5;
  var box1Mat = new BABYLON.StandardMaterial("box1Mat");
  box1Mat.diffuseTexture = new BABYLON.Texture("texture/albedo.png");
  box1.material = box1Mat;
  var box2 = box1.clone("tooth2");
  box2.position.x = -5;
  var box3 = box1.clone("tooth3");
  box3.position.x = 0;
  box3.position.y = 5;
  box3.rotation.z = Math.PI / 2;
  box4 = box3.clone("tooth4");
  box4.position.y = -5;
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
  joint1.setMotor(1 * forceFactor, 20 * forceFactor);

  //enable Physics in the scene
  scene.enablePhysics();


  return scene;
}


//（定義したsceneを変数（定数でもいい）で定義）
var scene = createScene();

//定義した変数を実行する関数を定義
engine.runRenderLoop(function() {
  //表示の実行
  scene.render();
});
