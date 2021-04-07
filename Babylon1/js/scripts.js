var canvas = document.getElementById("renderCanvas");

// エンジン生成
var engine = new BABYLON.Engine(canvas, true);

var createScene = function() {

  // シーン生成
  var scene = new BABYLON.Scene(engine);

  //背景一色
  scene.clearColor = new BABYLON.Color3(1, 0.8, 0.8);
  //背景宇宙
  var skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, scene);
  var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("./textures/nebula/nebula", scene);
  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  skyboxMaterial.disableLighting = true;
  skybox.material = skyboxMaterial;

  // カメラの設定
  var camera = new BABYLON.ArcRotateCamera("Camera", -90/180*Math.PI, 45/180*Math.PI, Math.PI, new BABYLON.Vector3(0, 0, 0), scene);

  // ライトの設定
  var light0 = new BABYLON.HemisphericLight("light0", new BABYLON.Vector3(1, 1, 0), scene);

  // 球の設定（Legacy：次のどちらでも良い）／数値の20はセグメント数、1.0は球のサイズ
  var object = BABYLON.Mesh.CreateSphere("object", 20, 1.0, scene);

  //球を着色(ランダム色)
  // var material = new BABYLON.StandardMaterial(scene);
  // material.alpha = 1;
  // material.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
  // object.material = material;

  // Create materials　地球のテクスチャーを張り付け
  var earthMaterial = new BABYLON.StandardMaterial("ground", scene);
  earthMaterial.diffuseTexture = new BABYLON.Texture("./textures/earth.jpg", scene);
  earthMaterial.diffuseTexture.uScale = -1;
  earthMaterial.diffuseTexture.vScale = -1;
  object.material = earthMaterial;

  // カメラのコントロールを可能
  camera.attachControl(canvas);

  //animation

  // 自転の傾きを設定
  var earthAxis = new BABYLON.Vector3(Math.sin(23.4/180 * Math.PI), Math.cos(23.4/180 * Math.PI), 0);
  // 回転速度（1フレーム毎の回転角：ラジアン）を設定
  var angle = 0.003;
  scene.registerBeforeRender(function() {
    object.rotate(earthAxis, angle, BABYLON.Space.WORLD);
  })

  return scene;
};

var scene = createScene();



engine.runRenderLoop(function() {

  //表示の実行
  scene.render();
});