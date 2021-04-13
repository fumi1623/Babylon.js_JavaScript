//表示場所の確保
var canvas = document.getElementById("renderCanvas");

// エンジン生成
var engine = new BABYLON.Engine(canvas);

const createScene = function()  {

  var scene = new BABYLON.Scene(engine);
  var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, BABYLON.Vector3.Zero(), scene);
  camera.setPosition(new BABYLON.Vector3(-15, 3, 0));
  camera.attachControl(canvas, true);
  var material = new BABYLON.StandardMaterial("kosh", scene);
  var sphere1 = BABYLON.Mesh.CreateSphere("Sphere1", 32, 5, scene);
  var light = new BABYLON.PointLight("Omni0", new BABYLON.Vector3(-17.6, 18.8, -49.9), scene);

  //sphere1 material
  material.refractionTexture = new BABYLON.CubeTexture("texture/TropicalSunnyDay", scene);
  material.reflectionTexture = new BABYLON.CubeTexture("texture/TropicalSunnyDay", scene);
  material.diffuseColor = new BABYLON.Color3(0, 0, 0);
  material.invertRefractionY = false;
  material.indexOfRefraction = 0.98;
  material.specularPower = 128;
  sphere1.material = material;

  material.refractionFresnelParameters = new BABYLON.FresnelParameters();
  material.refractionFresnelParameters.power = 2;
  material.reflectionFresnelParameters = new BABYLON.FresnelParameters();
  material.reflectionFresnelParameters.power = 2;
  material.reflectionFresnelParameters.leftColor = BABYLON.Color3.Black();
  material.reflectionFresnelParameters.rightColor = BABYLON.Color3.White();

  // Skybox
  var skybox = BABYLON.Mesh.CreateBox("skyBox", 100.0, scene);
  var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("texture/TropicalSunnyDay", scene);
  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  skyboxMaterial.disableLighting = true;
  skybox.material = skyboxMaterial;

	var colorGrading = new BABYLON.ColorGradingTexture("texture/LateSunset.3dl", scene);
	scene.imageProcessingConfiguration.colorGradingEnabled = true;
  scene.imageProcessingConfiguration.colorGradingTexture = colorGrading;

	var i = 0;
	engine.runRenderLoop(function () {
		colorGrading.level = Math.sin(i++ / 120) * 0.5 + 0.5;
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
