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
  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(4, 1, 0));

  //真ん中の地面の設定
  const groundMat = new BABYLON.StandardMaterial("groundMat");
  groundMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/villagegreen.png")
  groundMat.diffuseTexture.hasAlpha = true;
  //真ん中の地面の表示
  const ground = BABYLON.MeshBuilder.CreateGround("ground", {width:24, height:24});
  ground.material = groundMat;

  //地面の設定
  const largeGroundMat = new BABYLON.StandardMaterial("largeGroundMat");
  largeGroundMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/valleygrass.png")
  //地面表示
  const largeGround = BABYLON.MeshBuilder.CreateGroundFromHeightMap("largeGround", "https://assets.babylonjs.com/environments/villageheightmap.png", {width:150, height:150, subdivisions: 20, minHeight:0, maxHeight: 10});
  largeGround.material = largeGroundMat; //設定の反映
  largeGround.position.y = -0.01;

  //skybox
  buildSky();

  //house設置
  buildDwellings();

  //tree配置
  buildTrees();

  //Fountain配置
  buildFountain();

  //car配置
  const car = buildCar();
  car.rotation.x = -Math.PI / 2;
  car.rotation.y = Math.PI / 2;
  car.position.y = 0.16;
  car.position.x = 3;
  car.position.z = 10;
  //car animation
  const animCar = new BABYLON.Animation("carAnimation", "position.z", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
  const carKeys = [];
  carKeys.push({frame: 0, value: 10});
  carKeys.push({frame: 150, value: -5});
  animCar.setKeys(carKeys);
  car.animations = [];
  car.animations.push(animCar);
  scene.beginAnimation(car, 0, 150, true);

  //車輪
  //見た目設定
  const wheelUV = [];
  wheelUV[0] = new BABYLON.Vector4(0, 0, 1, 1);
  wheelUV[1] = new BABYLON.Vector4(0, 0.5, 0, 0.5);
  wheelUV[2] = new BABYLON.Vector4(0, 0, 1, 1);
  const wheelMat = new BABYLON.StandardMaterial("wheelMat");
  wheelMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/wheel.png");

  //車輪設定
  const wheelRB = BABYLON.MeshBuilder.CreateCylinder("wheelRB", {diameter: 0.125, height: 0.05, faceUV: wheelUV});
  wheelRB.material = wheelMat;  //見た目適応
  wheelRB.parent = car;  //carとくっ付ける
  wheelRB.position.z = -0.1;
  wheelRB.position.x = -0.2;
  wheelRB.position.y = 0.035;

  wheelRF = wheelRB.clone("wheelRF");
  wheelRF.position.x = 0.1;

  wheelLB = wheelRB.clone("wheelLB");
  wheelLB.position.y = -0.2 - 0.035;

  wheelLF = wheelRF.clone("wheelLF");
  wheelLF.position.y = -0.2 - 0.035;

  //Animate the Wheels
  const animWheel = new BABYLON.Animation("wheelAnimation", "rotation.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

  const wheelKeys = [];

  //At the animation key 0, the value of rotation.y is 0
  wheelKeys.push({
      frame: 0,
      value: 0
  });

  //At the animation key 30, (after 1 sec since animation fps = 30) the value of rotation.y is 2PI for a complete rotation
  wheelKeys.push({
      frame: 30,
      value: 2 * Math.PI
  });

  //set the keys
  animWheel.setKeys(wheelKeys);

  //Link this animation to a wheel
  wheelRB.animations = [];
  wheelRB.animations.push(animWheel);
  wheelRF.animations = [];
  wheelRF.animations.push(animWheel);
  wheelLB.animations = [];
  wheelLB.animations.push(animWheel);
  wheelLF.animations = [];
  wheelLF.animations.push(animWheel);

  scene.beginAnimation(wheelRB, 0, 30, true);
  scene.beginAnimation(wheelRF, 0, 30, true);
  scene.beginAnimation(wheelLB, 0, 30, true);
  scene.beginAnimation(wheelLF, 0, 30, true);

  return scene;
}

const buildFountain = function() {
  const fountainOutline = [
		new BABYLON.Vector3(0, 0, 0),
		new BABYLON.Vector3(0.5, 0, 0),
    new BABYLON.Vector3(0.5, 0.2, 0),
		new BABYLON.Vector3(0.4, 0.2, 0),
    new BABYLON.Vector3(0.4, 0.05, 0),
    new BABYLON.Vector3(0.05, 0.1, 0),
		new BABYLON.Vector3(0.05, 0.8, 0),
		new BABYLON.Vector3(0.15, 0.9, 0)
	];

  const fountain = BABYLON.MeshBuilder.CreateLathe("fountain", {shape: fountainOutline, sideOrientation: BABYLON.Mesh.DOUBLESIDE});
  fountain.position.x = -4;
  fountain.position.z = -6;

  return fountain;
}

const buildTrees = function() {
  const spriteManagerTrees = new BABYLON.SpriteManager("treesManager", "textures/palm.png", 2000, {width: 512, height: 1024}, scene);

  for (let i = 0; i < 500; i++) {
    const tree = new BABYLON.Sprite("tree", spriteManagerTrees);
    tree.position.x = Math.random() * (-30);
    tree.position.z = Math.random() * 20 + 8;
    tree.position.y = 0.5;
  }

  for (let i = 0; i < 500; i++) {
    const tree = new BABYLON.Sprite("tree", spriteManagerTrees);
    tree.position.x = Math.random() * (25) + 7;
    tree.position.z = Math.random() * -35 + 8;
    tree.position.y = 0.5;
  }

  return spriteManagerTrees;
}

const buildSky = function() {
  //skybox
  const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:150}, scene);
  const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
  skyboxMaterial.backFaceCulling = false
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox", scene);
  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  skybox.material = skyboxMaterial;
}

//carの設定
const buildCar = function() {
  //ベース
  const outline = [
    new BABYLON.Vector3(-0.3, 0, -0.1),
    new BABYLON.Vector3(0.2, 0, -0.1),
  ]

  //カーブ
  for (let i = 0; i < 20; i++) {
    outline.push(new BABYLON.Vector3(0.2 * Math.cos(i * Math.PI / 40), 0, 0.2 * Math.sin(i * Math.PI / 40) - 0.1));
  }

  //上側
  outline.push(new BABYLON.Vector3(0, 0, 0.1));
  outline.push(new BABYLON.Vector3(-0.3, 0, 0.1));

  //見た目
  const faceUV = [];
  faceUV[0] = new BABYLON.Vector4(0, 0.5, 0.38, 1);
  faceUV[1] = new BABYLON.Vector4(0, 0, 1, 0.5);
  faceUV[2] = new BABYLON.Vector4(0.38, 1, 0, 0.5);

  const carMat = new BABYLON.StandardMaterial("carMat");
  carMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/car.png");

  //carの定義
  const car = BABYLON.MeshBuilder.ExtrudePolygon("car", {shape: outline, depth: 0.2, faceUV: faceUV, wrap: true});
  car.material = carMat;

  return car;
}

//house生成設定
const buildDwellings = function() {

  //width=1
  const detached_house = buildHouse(1); //width of house 1or2
  detached_house.rotation.y = -Math.PI / 16;
  detached_house.position.x = -6.8;
  detached_house.position.z = 2.5;

  //width=2
  const semi_house = buildHouse(2); //width of house 1or2
  semi_house.rotation.y = -Math.PI / 16;
  semi_house.position.x = -4.5;
  semi_house.position.z = 3;

  const places = []; // [house type, rotation, x, y]
  places.push([1, -Math.PI / 16, -6.8, 2.5 ]);
  places.push([2, -Math.PI / 16, -4.5, 3 ]);
  places.push([2, -Math.PI / 16, -1.5, 4 ]);
  places.push([2, -Math.PI / 3, 1.5, 6 ]);
  places.push([2, 15 * Math.PI / 16, -6.4, -1.5 ]);
  places.push([1, 15 * Math.PI / 16, -4.1, -1 ]);
  places.push([2, 15 * Math.PI / 16, -2.1, -0.5 ]);
  places.push([1, 5 * Math.PI / 4, 0, -1 ]);
  places.push([1, Math.PI + Math.PI / 2.5, 0.5, -3 ]);
  places.push([2, Math.PI + Math.PI / 2.1, 0.75, -5 ]);
  places.push([1, Math.PI + Math.PI / 2.25, 0.75, -7 ]);
  places.push([2, Math.PI / 1.9, 4.75, -1 ]);
  places.push([1, Math.PI / 1.95, 4.5, -3 ]);
  places.push([2, Math.PI / 1.9, 4.75, -5 ]);
  places.push([1, Math.PI / 1.9, 4.75, -7 ]);
  places.push([2, -Math.PI / 3, 5.25, 2 ]);
  places.push([1, -Math.PI / 3, 6, 4 ]);

  const houses = [];
  for (let i = 0; i < places.length; i++) {
    if (places[i][0] === 1) {
      houses[i] = detached_house.createInstance("house" + i);
    } else {
      houses[i] = semi_house.createInstance("house" + i);
    }
    houses[i].rotation.y = places[i][1];
    houses[i].position.x = places[i][2];
    houses[i].position.z = places[i][3];
  }
}

//houseの設定を定義
const buildHouse = function(width) {
  const box = buildBox(width);
  const roof = buildRoof(width);

  return BABYLON.Mesh.MergeMeshes([box, roof], true, false, null, false, true);
}

//boxの設定を定義
const buildBox = function(width) {
  //boxの設定
  const boxMat = new BABYLON.StandardMaterial("boxMat");

  if (width == 2) {
    boxMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/semihouse.png");
  } else {
    //レンガの見た目
    // boxMat.diffuseTexture = new BABYLON.Texture("https://www.babylonjs-playground.com/textures/floor.png");
    //見た目(width=1)1
    boxMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/cubehouse.png");
  }

  //boxの側面
  const faceUV = [];
  if (width == 2) {
    faceUV[0] = new BABYLON.Vector4(0.6, 0.0, 1.0, 1.0);  //後
    faceUV[1] = new BABYLON.Vector4(0.0, 0.0, 0.4, 1.0);  //前
    faceUV[2] = new BABYLON.Vector4(0.4, 0.0, 0.6, 1.0);  //右
    faceUV[3] = new BABYLON.Vector4(0.4, 0.0, 0.6, 1.0);  //左
  } else {
    faceUV[0] = new BABYLON.Vector4(0.5, 0.0, 0.75, 1.0);  //後
    faceUV[1] = new BABYLON.Vector4(0.0, 0.0, 0.25, 1.0);  //前
    faceUV[2] = new BABYLON.Vector4(0.25, 0.0, 0.5, 1.0);  //右
    faceUV[3] = new BABYLON.Vector4(0.75, 0.0, 1.0, 1.0);  //左
  }

  //boxを表示
  const box = BABYLON.MeshBuilder.CreateBox("box", {width: width, faceUV: faceUV, wrap: true}); //{}内で側面の見た目(この行より上に定義する必要あり)
  box.material = boxMat; //設定の適応
  box.position.y = 0.5;

  return box;
}

//roofの設定を定義
const buildRoof = function(width) {
  //roofの設定
  const roofMat = new BABYLON.StandardMaterial("roofMat");
  roofMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/roof.jpg");
  //roofの表示
  const roof = BABYLON.MeshBuilder.CreateCylinder("roof", {diameter: 1.3, height: 1.2, tessellation: 3});
  roof.material = roofMat;
  roof.scaling.x = 0.75;
  roof.scaling.y = width;
  roof.rotation.z = Math.PI / 2;
  roof.position.y = 1.22;

  return roof;
}


//（定義したsceneを変数（定数でもいい）で定義）
var scene = createScene();

//定義した変数を実行する関数を定義
engine.runRenderLoop(function() {
  //表示の実行
  scene.render();
});

