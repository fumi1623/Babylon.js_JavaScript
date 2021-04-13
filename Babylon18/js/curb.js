//表示場所の確保
var canvas = document.getElementById("renderCanvas");

// エンジン生成
var engine = new BABYLON.Engine(canvas);

const createScene = function()  {

  var scene = new BABYLON.Scene(engine);
  //setup camera
  const camera = new BABYLON.ArcRotateCamera("Camera", 3 * Math.PI / 2, Math.PI / 2.2, 30, BABYLON.Vector3.Zero(), scene);
  camera.attachControl(canvas, true);
  var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 0.5, 0), scene);



  //Array of points for trapezium side of car.
  var side = [new BABYLON.Vector3(0, 4, -2),
              new BABYLON.Vector3(2, 3, -2),
              new BABYLON.Vector3(4, 4, -2),
              new BABYLON.Vector3(3.8, 4, -2),
              new BABYLON.Vector3(2, 3.2, -2),
              new BABYLON.Vector3(0.2, 4, -2),
              // new BABYLON.Vector3(5, -2, -2),
              // new BABYLON.Vector3(-7, -2, -2)
  ];

  // side.push(side[0]);	//close trapezium

	var extrudePath = [new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 0, 4)];
	
	//Create body and apply material
	var carBody = BABYLON.MeshBuilder.ExtrudeShape("body", {shape: side, path: extrudePath, cap : BABYLON.Mesh.CAP_ALL}, scene);

  return scene;
}


//（定義したsceneを変数（定数でもいい）で定義）
var scene = createScene();

//定義した変数を実行する関数を定義
engine.runRenderLoop(function() {
  //表示の実行
  scene.render();
});
