//表示場所の確保
var canvas = document.getElementById("renderCanvas");

// エンジン生成
var engine = new BABYLON.Engine(canvas);

const createScene = function()  {

  var scene = new BABYLON.Scene(engine);
	scene.clearColor = new BABYLON.Color3( .5, .5, .5);
  var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 3, 25, BABYLON.Vector3.Zero(), scene);
	camera.attachControl(canvas, true);
	var light = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(1, 1, 0), scene);

  var purpleMat = new BABYLON.StandardMaterial("purple", scene);
  purpleMat.diffuseColor = new BABYLON.Color3(1, 0, 1);
  var yellowMat = new BABYLON.StandardMaterial("yellow", scene);
  yellowMat.diffuseColor = new BABYLON.Color3(1, 1, 0);
  var blackMat = new BABYLON.StandardMaterial("black", scene);
  blackMat.diffuseColor = new BABYLON.Color3(0, 0, 0);

  var mainBody = new BABYLON.MeshBuilder.CreateBox("mainBody", {width:1.5, height:3, depth:1.5}, scene);
  mainBody.material = purpleMat;
  mainBody.visibility = 0.5;
  var localMain = localAxes(5);
  localMain.parent = mainBody;

  var connectedAxle = new BABYLON.MeshBuilder.CreateBox("connectedAxis", {width:0.5, height:6, depth:0.5}, scene);
	connectedAxle.material = yellowMat;
	connectedAxle.visibility = 0.5;
	var localConnected = localAxes(5);
	localConnected.parent = connectedAxle;

  var mainPivot = new BABYLON.MeshBuilder.CreateSphere("mainPivot", {diameter: 0.25}, scene);
  mainPivot.material = purpleMat;
  var connectedPivot = new BABYLON.MeshBuilder.CreateSphere("connectedPivot", {diameter: 0.25}, scene);
  connectedPivot.material = yellowMat;
	var startingPoint = new BABYLON.MeshBuilder.CreateSphere("connectedPivot", {diameter: 0.4}, scene);
	startingPoint.material = blackMat;

	mainPivot.position = new BABYLON.Vector3(0, 0, 0);
	connectedPivotPosition = new BABYLON.Vector3(0, 0, 0);
	connectedPivot.position = connectedPivotPosition.scale(-1);
	startingPoint.position = mainPivot.position.add(connectedPivot.position);
	
	mainBody.position = startingPoint.position;

  //physics starts
  scene.enablePhysics(BABYLON.Vector3.Zero(), new BABYLON.CannonJSPlugin());
  //scene.enablePhysics(BABYLON.Vector3.Zero(), new BABYLON.OimoJSPlugin());
  // scene.enablePhysics(BABYLON.Vector3.Zero(), new BABYLON.AmmoJSPlugin());

  mainBody.physicsImpostor = new BABYLON.PhysicsImpostor(mainBody, BABYLON.PhysicsImpostor.BoxImpostor, {mass:1});
  connectedAxle.physicsImpostor = new BABYLON.PhysicsImpostor(connectedAxle, BABYLON.PhysicsImpostor.BoxImpostor, {mass:0});

  var joint = new BABYLON.HingeJoint({
    mainPivot: mainPivot.position,
    connectedPivot: connectedPivotPosition,
    mainAxis: new BABYLON.Vector3(0, 1, 0),
    connectedAxis: new BABYLON.Vector3(0, 1, 0)
  });

  connectedAxle.physicsImpostor.addJoint(mainBody.physicsImpostor, joint);
  joint.setMotor(1, 1000);

  //Local Axes
  function localAxes(size) {
    var makeTextPlane = function(text, color, size) {
        var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, scene, true);
        dynamicTexture.hasAlpha = true;
        dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color , "transparent", true);
        var plane = new BABYLON.Mesh.CreatePlane("TextPlane", size, scene, true);
        plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
        plane.material.backFaceCulling = false;
        plane.material.specularColor = new BABYLON.Color3(0, 0, 0);
        plane.material.diffuseTexture = dynamicTexture;
        plane.billBoardMode = 7;
        return plane;
    };

    var pilot_local_axisX = BABYLON.Mesh.CreateLines("pilot_local_axisX", [
        new BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
        new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
    ], scene);
    pilot_local_axisX.color = new BABYLON.Color3(1, 0, 0);
    var xChar = makeTextPlane("X", "red", size / 10);
    xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);

    pilot_local_axisY = BABYLON.Mesh.CreateLines("pilot_local_axisY", [
        new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(-0.05 * size, size * 0.95, 0),
        new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(0.05 * size, size * 0.95, 0)
    ], scene);
    pilot_local_axisY.color = new BABYLON.Color3(0, 1, 0);
    var yChar = makeTextPlane("Y", "green", size / 10);
    yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);

    var pilot_local_axisZ = BABYLON.Mesh.CreateLines("pilot_local_axisZ", [
        new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0 , -0.05 * size, size * 0.95),
        new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0, 0.05 * size, size * 0.95)
    ], scene);
    pilot_local_axisZ.color = new BABYLON.Color3(0, 0, 1);
    var zChar = makeTextPlane("Z", "blue", size / 10);
    zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);


    var local_origin = BABYLON.MeshBuilder.CreateBox("local_origin", {size:1}, scene);
    local_origin.isVisible = false;

    pilot_local_axisX.parent = local_origin;
    pilot_local_axisY.parent = local_origin;
    pilot_local_axisZ.parent = local_origin;

    xChar.parent = local_origin;
    yChar.parent = local_origin;
    zChar.parent = local_origin;

    return local_origin;
  }

  return scene;
}

//（定義したsceneを変数（定数でもいい）で定義）
var scene = createScene();

//定義した変数を実行する関数を定義
engine.runRenderLoop(function() {
  //表示の実行
  scene.render();
});