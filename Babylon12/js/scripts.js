//表示場所の確保
var canvas = document.getElementById("renderCanvas");

// エンジン生成
var engine = new BABYLON.Engine(canvas);


//表示の中身（sceneの定義）
const createScene = function() {
  const scene = new BABYLON.Scene(engine);

  /**** Set camera and light *****/
  const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 4, 10, BABYLON.Vector3.Zero());
  camera.attachControl(canvas, true);

  const light1 = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(0, -1, 1));
  const light2 = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 1, 0));
  light1.intensity = 0.75;
  light2.intensity = 0.5;

  const box1 = BABYLON.MeshBuilder.CreateBox("box", {width:10, height:1, depth:0.1});
  box1.rotation.z = -Math.PI / 12;
  box1.rotation.y = Math.PI / 2;
  box1.position.x = 1.6;
  const box2 = BABYLON.MeshBuilder.CreateBox("box", {width:10, height:.1, depth:1.5});
  box2.position.x = .8;
  box2.position.y = -0.45;
  box2.rotation.z = -Math.PI / 12;
  box2.rotation.y = Math.PI / 2;
  const box3 = BABYLON.MeshBuilder.CreateBox("box", {width:10, height:1, depth:0.1});
  box2.position.x = .8;
  box2.position.y = -0.2;
  box2.position.z = 0.05;
  box3.rotation.z = -Math.PI / 12;
  box3.rotation.y = Math.PI / 2;

  const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter:1.3});
  sphere.position.x = .8;
  sphere.position.y = 3;
  sphere.position.z = 3;

  return scene;
}

//（定義したsceneを変数（定数でもいい）で定義）
var scene = createScene();

//定義した変数を実行する関数を定義
engine.runRenderLoop(function() {
  //表示の実行
  scene.render();
});

