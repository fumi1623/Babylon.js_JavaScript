//表示場所の確保
var canvas = document.getElementById("renderCanvas");

// エンジン生成
var engine = new BABYLON.Engine(canvas);

const createScene = function()  {

  var scene = new BABYLON.Scene(engine);

	scene.enablePhysics();

  // Light
  var spot = new BABYLON.PointLight("spot", new BABYLON.Vector3(0, 300, 100), scene);
  spot.diffuse = new BABYLON.Color3(1, 1, 1);
  spot.specular = new BABYLON.Color3(0, 0, 0);

  // Camera
  var camera = new BABYLON.ArcRotateCamera("Camera", -1, 0.5, 600, BABYLON.Vector3.Zero(), scene);
  camera.attachControl(canvas, true);

  // Ground
  var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
  groundMaterial.diffuseTexture = new BABYLON.Texture("texture/earth.jpg", scene);

  var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "texture/worldHeightMap.jpg", 200, 200, 50, 0, 30, scene, false, function () {
  var exponentialPath = function (p) {
    var path = [];
    for (var i = -50; i <= 50; i++) {
        path.push(new BABYLON.Vector3(p-50, (Math.sin(p / 3) * 10 * Math.exp((i - p) / 100) + i / 3), i));
    }
    return path;
  };
  // let's populate arrayOfPaths with all these different paths
  var arrayOfPaths = [];
  for (var p = 0; p <= 100; p++) {
      arrayOfPaths[p] = exponentialPath(p);
  }

  // (name, array of paths, closeArray, closePath, offset, scene)
  var mesh = BABYLON.Mesh.CreateRibbon("ribbon", arrayOfPaths, false, false, 0, scene);

  mesh.position.y += 100;
  mesh.physicsImpostor = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.HeightmapImpostor, { mass: 0, friction:1, restitution: 0.5 });

  ground.position.z -= 100;
  ground.rotate(BABYLON.Axis.X, 0.4);
  ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.HeightmapImpostor, { mass: 0 });
  camera.setTarget(ground);

  var ticker = 0;

  scene.registerBeforeRender(function() {
    if((ticker++ % 120)) return;
    for (var ii = 0; ii < 10; ii++) {
      var b = BABYLON.Mesh.CreateSphere("s", 4, 10, scene);
      b.position.y = 150;
      b.position.x = (Math.random() * 50) * ((ii%2==1) ? -1 : 1);
      b.position.z = (Math.random() * 50) * ((ii % 3==1) ? -1 : 1);
      b.physicsImpostor = new BABYLON.PhysicsImpostor(b, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, friction: 0, restitution: 0 });
    }
    // for (var ii = 0; ii < 4; ii++) {
    //     var box = BABYLON.Mesh.CreateBox("s", 8, scene);

    //     box.position.y = 150;
    //     box.position.x = (Math.random() * 100) * ((ii % 2 == 1) ? -1 : 1);
    //     box.position.z = (Math.random() * 100) * ((ii % 3 == 1) ? -1 : 1);
    //     box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, friction: 0, restitution: 0 });
    // }
    });
    scene.registerBeforeRender(function () {
      scene.meshes.forEach(function (m) {
        if (m.name=="s" && m.position.y < -100) {
          m.dispose();
        }
      })
    });
	});
  ground.material = groundMaterial;
  return scene;
}

//（定義したsceneを変数（定数でもいい）で定義）
var scene = createScene();

//定義した変数を実行する関数を定義
engine.runRenderLoop(function() {
  //表示の実行
  scene.render();
});
