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

  


  return scene;
}

//（定義したsceneを変数（定数でもいい）で定義）
var scene = createScene();

//定義した変数を実行する関数を定義
engine.runRenderLoop(function() {
  //表示の実行
  scene.render();
});
