//表示場所の確保
var canvas = document.getElementById("renderCanvas");

// エンジン生成
var engine = new BABYLON.Engine(canvas);


//表示の中身（sceneの定義）
const createScene = function() {
  const scene = new BABYLON.Scene(engine);

  /**** Set camera and light *****/
  const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, new BABYLON.Vector3(0, 0, 0));
  camera.upperBetaLimit = Math.PI / 2.2;
  camera.attachControl(canvas, true);
  const light = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 50, 0));
  light.intensity = 0.5;

  buildLight();

  return scene;
}

const buildLight = function() {

  const lampLight = new BABYLON.SpotLight("lampLight", BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, -1, 0), Math.PI, 1, scene);
  lampLight.diffuse = BABYLON.Color3.Yellow();

  const lampShape = [];
  for(let i = 0; i < 20; i++) {
    lampShape.push(new BABYLON.Vector3(Math.cos(i * Math.PI / 10), Math.sin(i * Math.PI / 10), 0));
  }
  lampShape.push(lampShape[0]);

  const lampPath = [];
  lampPath.push(new BABYLON.Vector3(0, 0, 0));
  lampPath.push(new BABYLON.Vector3(0, 10, 0));
  for(let i = 0; i < 20; i++) {
    lampPath.push(new BABYLON.Vector3(1 + Math.cos(Math.PI - i * Math.PI / 40), 10 + Math.sin(Math.PI - i * Math.PI / 40), 0));
  }
  lampPath.push(new BABYLON.Vector3(3, 11, 0));

  const yellowMat = new BABYLON.StandardMaterial("yellowMat");
  yellowMat.emissiveColor = BABYLON.Color3.Yellow();

  const lamp = BABYLON.MeshBuilder.ExtrudeShape("lamp", {cap: BABYLON.Mesh.CAP_END, shape: lampShape, path: lampPath, scale: 0.5});

  const bulb = BABYLON.MeshBuilder.CreateSphere("bulb", {diameterX: 1.5, diameterZ: 0.8});

  bulb.material = yellowMat;
  bulb.parent = lamp;
  bulb.position.x = 2;
  bulb.position.y = 10.5;

  lampLight.parent = bulb;

  const ground = BABYLON.MeshBuilder.CreateGround("ground", {width:50, height:50});

}

//（定義したsceneを変数（定数でもいい）で定義）
var scene = createScene();

//定義した変数を実行する関数を定義
engine.runRenderLoop(function() {
  //表示の実行
  scene.render();
});

