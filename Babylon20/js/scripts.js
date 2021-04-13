//表示場所の確保
var canvas = document.getElementById("renderCanvas");

// エンジン生成
var engine = new BABYLON.Engine(canvas);

const createScene = function()  {
  const scene = new BABYLON.Scene(engine);
  // camera
  var camera = new BABYLON.ArcRotateCamera("camera1",  0, 0, 0, new BABYLON.Vector3(0, 0, 0), scene);
  camera.setPosition(new BABYLON.Vector3(-12, 10, -24));
  camera.attachControl(canvas, true);
  // light
  var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 0.5, 0), scene);

  //carBody
  var bodyMaterial = new BABYLON.StandardMaterial("body_mat", scene);
  bodyMaterial.diffuseColor = new BABYLON.Color3(1.0, 0.25, 0.25);
  bodyMaterial.backFaceCulling = false;
	//Array of points for trapezium side of car.
	var side = [new BABYLON.Vector3(-4, 2, -2),
    new BABYLON.Vector3(4, 2, -2),
    new BABYLON.Vector3(5, -2, -2),
    new BABYLON.Vector3(-7, -2, -2)
  ];
  side.push(side[0]);	//close trapezium
	//Array of points for the extrusion path
	var extrudePath = [new BABYLON.Vector3(0, 0, -2), new BABYLON.Vector3(0, 0, 2)];
  //Create body and apply material
	var carBody = BABYLON.MeshBuilder.ExtrudeShape("body", {shape: side, path: extrudePath, cap : BABYLON.Mesh.CAP_ALL}, scene);
	carBody.material = bodyMaterial;

  //wheel
  var wheelMaterial = new BABYLON.StandardMaterial("wheel_mat", scene);
  var wheelTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/wheel.png", scene);
  wheelMaterial.diffuseTexture = wheelTexture;
	//Set color for wheel tread as black
	var faceColors=[];
	faceColors[1] = new BABYLON.Color3(0,0,0);
	//set texture for flat face of wheel
	var faceUV =[];
	faceUV[0] = new BABYLON.Vector4(0,0,1,1);
	faceUV[2] = new BABYLON.Vector4(0,0,1,1);
	//create wheel front inside and apply material
	var wheelFI = BABYLON.MeshBuilder.CreateCylinder("wheelFI", {diameter: 3, height: 1, tessellation: 24, faceColors:faceColors, faceUV:faceUV}, scene);
  wheelFI.material = wheelMaterial;
	//rotate wheel so tread in xz plane
  wheelFI.rotate(BABYLON.Axis.X, Math.PI/2, BABYLON.Space.WORLD);
	wheelFI.parent = carBody;
  //wheel instance
  var wheelFO = wheelFI.createInstance("FO");
  wheelFO.parent = carBody;
  wheelFO.position = new BABYLON.Vector3(-4.5, -2, 0.8);
  var wheelRI = wheelFI.createInstance("RI");
  wheelRI.parent = carBody;
  wheelRI.position = new BABYLON.Vector3(2.5, -2, -4.8);
  var wheelRO = wheelFI.createInstance("RO");
  wheelRO.parent = carBody;
  wheelRO.position = new BABYLON.Vector3(2.5, -2, 0.8);
  wheelFI.position = new BABYLON.Vector3(-4.5, -2, -4.8);

  //curve
  var points = [];
  var n = 450;
  var r = 50;
  for (i = 0; i < n + 1; i++) {
    points.push(new BABYLON.Vector3((r + (r/5)*Math.sin(8*i*Math.PI/n))* Math.sin(2*i*Math.PI/n), 0, (r + (r/10)*Math.sin(6*i*Math.PI/n)) * Math.cos(2*i*Math.PI/n)));
  }
	var track = BABYLON.MeshBuilder.CreateLines('track', {points: points}, scene);
	track.color = new BABYLON.Color3(0, 0, 0);
  //ground
  var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 3*r, height: 3*r}, scene);

  //car position and rotate
  carBody.position.y = 4;
  carBody.position.z = r;
  var path3d = new BABYLON.Path3D(points);
  var normals = path3d.getNormals();
  var theta = Math.acos(BABYLON.Vector3.Dot(BABYLON.Axis.Z,normals[0]));
  carBody.rotate(BABYLON.Axis.Y, theta, BABYLON.Space.WORLD);

  //animation
  var i = 0;
  scene.registerAfterRender(function() {
    carBody.position.x = points[i].x;
    carBody.position.z = points[i].z;
    wheelFI.rotate(normals[i], Math.PI/32, BABYLON.Space.WORLD);
    wheelFO.rotate(normals[i], Math.PI/32, BABYLON.Space.WORLD);
    wheelRI.rotate(normals[i], Math.PI/32, BABYLON.Space.WORLD);
    wheelRO.rotate(normals[i], Math.PI/32, BABYLON.Space.WORLD);
    theta = Math.acos(BABYLON.Vector3.Dot(normals[i],normals[i+1]));
    var dir = BABYLON.Vector3.Cross(normals[i],normals[i+1]).y;
    var dir = dir/Math.abs(dir);
    carBody.rotate(BABYLON.Axis.Y, dir * theta, BABYLON.Space.WORLD);
    i = (i + 1) % (n-1);	//continuous looping
  })


  return scene;
}

var buildCar = function() {
  
}

//（定義したsceneを変数（定数でもいい）で定義）
var scene = createScene();

//定義した変数を実行する関数を定義
engine.runRenderLoop(function() {
  //表示の実行
  scene.render();
});
