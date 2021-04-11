//表示場所の確保
var canvas = document.getElementById("renderCanvas");

// エンジン生成
var engine = new BABYLON.Engine(canvas);

const createScene = function()  {

  const scene = new BABYLON.Scene(engine);
  scene.enablePhysics();

  //physics engine
  var physicsViewer = new BABYLON.Debug.PhysicsViewer();
  var physicsHelper = new BABYLON.PhysicsHelper(scene);

  //camera
  var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 24, -64), scene);
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, true);

  //light
  var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.7;

  //ground
  var ground = BABYLON.Mesh.CreateGround("ground1", 64, 64, 2, scene);
  ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, {mass:0, restitution:1}, scene);

  //box
  var boxSize = 2;
  var boxPadding = 4;
  var minXY = -12;
  var maxXY = 12;
  var maxZ = 8;
  var boxParams = {height:boxSize, width:boxSize, depth:boxSize};
  var boxImpostorParams = {mass:boxSize, restitution:0, friction:1};
  var boxMaterial = new BABYLON.StandardMaterial("boxMaterial");
  boxMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);
  for (var x = minXY; x <= maxXY; x += boxSize + boxPadding) {
    for (var z = minXY; z <= maxXY; z += boxSize + boxPadding) {
      for (var y = boxSize / 2; y <= maxZ; y += boxSize) {
        var boxName = "box: " + x + ',' + y + ',' + z;
        var box = BABYLON.MeshBuilder.CreateBox(boxName, boxParams, scene);
        box.position = new BABYLON.Vector3(x, y, z);
        box.material = boxMaterial;
        box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, boxImpostorParams, scene);
        physicsViewer.showImpostor(box.physicsImpostor);
      }
    }
  }

  //radial explosion impulse/force
  var radius = 8;
  var strength = 20;
  var origins = [new BABYLON.Vector3(-8, 6, 0), new BABYLON.Vector3(0, 0, 0),];

  for (var i = 0; i < origins.length; i++) {
    var origin = origins[i];
    setTimeout(function(origin) {
      var event = physicsHelper.applyRadialExplosionImpulse( // or .applyRadialExplosionForce
        origin,
        {
          radius: radius,
          strength: strength,
          falloff: BABYLON.PhysicsRadialImpulseFalloff.Liner, // or BABYLON.PhysicsRadialImpulseFalloff.Constant
        }
      );

      //Debug
      var eventData = event.getData();
      var debugData = showExplosionDebug(eventData);
      setTimeout(function(debugData){
        hideExplosionDebug(debugData);
        event.dispose();
      }, 1500, debugData);
      //Debug - END
    }, i * 2000 + 1000, origin);
  }

  //gravitational field
  var gravitationalFieldOrigin = new BABYLON.Vector3(0, 6, 10);
  setTimeout(function() {
    var event = physicsHelper.gravitationalField(
      gravitationalFieldOrigin,
      {
        radius: radius,
        strength: strength,
        falloff: BABYLON.PhysicsRadialImpulseFalloff.Linear,
      }
    );
    event.enable();

    //Debug
    var eventData = event.getData();
    var sphere = eventData.sphere;
    addMaterialToMesh(sphere);
    sphere.isVisible = true;

    setTimeout(function(sphere) {
      event.disable();
      sphere.isVisible = false;
      event.dispose(); // we need to cleanup/dispose, after we don't use the data anymore
    }, 3000, sphere);
    //Debug - END
  }, 4000);

  //updraft
  var updraftOrigin = new BABYLON.Vector3(12, 0, 12);
  setTimeout(function() {
    var event = physicsHelper.updraft(
      updraftOrigin,
      {
        radius: 12,
        strength: 2,
        height: 20,
      }
    );
    event.enable();

    //Debug
    var eventData = event.getData();
    var cylinder = eventData.cylinder;
    addMaterialToMesh(cylinder);
    cylinder.isVisible = true;

    setTimeout(function(cylinder){
      event.disable();
      cylinder.isVisible = false;
      event.dispose();
    }, 2000, cylinder);
    // Debug - END
  }, 6000);

  //Vortex
  var vortexOrigin = new BABYLON.Vector3(0, -8, 8);
  setTimeout(function() {
    var event = physicsHelper.vortex(
      vortexOrigin,
      {
        radius: 20,
        strength: 40,
        height: 30,
      }
    );
    event.enable();

    //Debug
    var eventData = event.getData();
    var cylinder = eventData.cylinder;
    addMaterialToMesh(cylinder);
    cylinder.isVisible = true;

    setTimeout(function(cylinder){
      event.disable();
      cylinder.isVisible = false;
      event.dispose();
    }, 10000, cylinder);
    //Debug - END
  }, 8000);

  //Helper
  function addMaterialToMesh(sphere){
    var sphereMaterial = new BABYLON.StandardMaterial("sphereMaterial", scene);
    sphereMaterial.alpha = 0.5;
    sphere.material = sphereMaterial;
  }

  function showExplosionDebug(data){
    addMaterialToMesh(data.sphere);
    data.sphere.isVisible = true;
    return {sphere: data.sphere, };
  }

  function hideExplosionDebug(debugData){
    debugData.sphere.isVisible = false;
  }

  return scene;
}

//（定義したsceneを変数（定数でもいい）で定義）
var scene = createScene();

//定義した変数を実行する関数を定義
engine.runRenderLoop(function() {
  //表示の実行
  scene.render();
});
