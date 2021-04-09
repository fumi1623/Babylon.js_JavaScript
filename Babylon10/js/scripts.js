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

  const box = BABYLON.MeshBuilder.CreateBox("box", {});
  box.position.x = 2;

  const frameRate = 10;

  const xSlide = new BABYLON.Animation("xSlide", "position.x", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

  const keyFrames = [];
  keyFrames.push({ frame: 0, value: 2});
  keyFrames.push({ frame: frameRate, value: -2});
  keyFrames.push({ frame: 2 * frameRate, value: 2});

  xSlide.setKeys(keyFrames);

  box.animations.push(xSlide);

  const myAnim = scene.beginAnimation(box, 0, 2 * frameRate, true); //(target, from, to, true)

  setTimeout(() => {myAnim.stop()}, 5000);

  return scene;
}

//（定義したsceneを変数（定数でもいい）で定義）
var scene = createScene();

//定義した変数を実行する関数を定義
engine.runRenderLoop(function() {
  //表示の実行
  scene.render();
});

