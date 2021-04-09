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
  light.intensity = 1;



  return scene;
}

//（定義したsceneを変数（定数でもいい）で定義）
var scene = createScene();

//定義した変数を実行する関数を定義
engine.runRenderLoop(function() {
  //表示の実行
  scene.render();
});
