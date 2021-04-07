//表示場所の確保
var canvas = document.getElementById("renderCanvas");

// エンジン生成
var engine = new BABYLON.Engine(canvas, true);

//表示の中身（sceneの定義）
const createScene = function() {
  const scene = new BABYLON.Scene(engine);

  const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new BABYLON.Vector3(0, 0, 0));
  camera.attachControl(canvas, true);

  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0));

  //地面を表示
  const ground = BABYLON.MeshBuilder.CreateGround("ground", {width:10, height:10});

  //boxを表示
  const box = BABYLON.MeshBuilder.CreateBox("box", {});

  //boxの大きさ設定
  // box.scaling.x = 2;
  // box.scaling.y = 1.5;
  // box.scaling.z = 3;
  //大きさ一括
  box.scaling = new BABYLON.Vector3(2, 1.5, 3);

  //boxの場所
  // box.position.x = -2;
  // box.position.y = 4.2;
  // box.position.z = 0.1;
  //場所一括
  box.position = new BABYLON.Vector3(-2, 4.2, 0.1);

  //boxの回転(２通り)
  box.rotation.y = Math.PI / 4;
  // box.rotation.y = BABYLON.Tools.ToRadians(45);


  //sound設定
  // const sound = new BABYLON.Sound("sound", "url to sound file", scene);
  //Leave time for the sound file to load before playing it
  // sound.play();

  //BABYLON.SceneLoader.ImportMeshAsync(モデル名、フォルダーパス、ファイル名、シーン);
  //モデル１つ
  //BABYLON.SceneLoader.ImportMeshAsync("semi_house", "https://assets.babylonjs.com/meshes/", "both_houses_scene.babylon");
  //モデル複数
  // BABYLON.SceneLoader.ImportMeshAsync(["ground", "semi_house"], "https://assets.babylonjs.com/meshes/", "both_houses_scene.babylon");
  //位置も指定
  // BABYLON.SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "both_houses_scene.babylon").then((result) => {
  //   const house1 = scene.getMeshByName("detached_house");
  //   house1.position.y = 2;
  //   const house2 = result.meshes[2];
  //   house2.position.y = 1;
  // });


  return scene;
}

//（定義したsceneを変数（定数でもいい）で定義）
var scene = createScene();

//定義した変数を実行する関数を定義
engine.runRenderLoop(function() {
  //表示の実行
  scene.render();
});