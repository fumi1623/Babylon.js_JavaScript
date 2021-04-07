//表示の中身（sceneの定義）
const createScene = function() {
  const scene = new BABYLON.Scene(engine);

  //カメラ設定
  const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 10, new BABYLON.Vector3(0, 0, 0));
  camera.attachControl(canvas, true);
  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));

  buildDwellings();

  return scene;
}

//house生成設定
const buildDwellings = function() {
  const ground = buildGround();

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

//地面の設定を定義
const buildGround = function() {
  //地面の設定
  const groundMat = new BABYLON.StandardMaterial("groundMat");
  groundMat.diffuseColor = new BABYLON.Color3(0, 1, 0);
  //地面を表示
  const ground = BABYLON.MeshBuilder.CreateGround("ground", {width:15, height:16});
  //地面の設定を適応
  ground.material = groundMat;
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
