'use strict';

import SphereM1 from './objects/SphereM1';
import Sphere from './objects/Sphere';
import Sphere2 from './objects/Sphere2';
import Sphere3 from './objects/Sphere3';
import Plane from './objects/Plane';
import Cube from './objects/Cube';
import Cube2 from './objects/Cube2';
import Cube3 from './objects/Cube3';
import Ring from './objects/Ring';
import THREE from 'three';

window.THREE = THREE;

let OrbitControls = require('three-orbit-controls')(THREE)


export default class Webgl {
  constructor(width, height, audio) {
    this.audio = audio;



    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(20, width / height, 1, 1000);
    this.camera.position.z = 100;
    this.camera.lookAt(new THREE.Vector3(0, 0, 0))

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x000000);

    this.usePostprocessing = true;
    this.composer = new WAGNER.Composer(this.renderer);
    this.composer.setSize(width, height);
    this.initPostprocessing();

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.plane = new Plane();
    this.plane.position.set(0, 0, 0);
    this.scene.add(this.plane);

    this.cube = new Cube();
    this.cube.position.set(0, 0, 0);
    this.scene.add(this.cube);
    this.cube2 = new Cube2();
    this.cube2.position.set(5, 0, 0);
    this.scene.add(this.cube2);
    this.cube3 = new Cube3();
    this.cube3.position.set(-5, 0, 0);
    this.scene.add(this.cube3);


    // this.sphere_m1 = new SphereM1();
    // this.sphere_m1.position.set(0, -13, 0);
    // this.scene.add(this.sphere_m1);

    // this.sphere = new Sphere();
    // this.sphere.position.set(0, 0, 0);
    // this.scene.add(this.sphere);

    // this.sphere2 = new Sphere2();
    // this.sphere2.position.set(0, 8, 0);
    // this.scene.add(this.sphere2);


    // this.sphere3 = new Sphere3();
    // this.sphere3.position.set(0, 18, 0);
    // this.scene.add(this.sphere3);

    this.ring = new Ring();
    this.ring.position.set(0, 0, 0);
    this.scene.add(this.ring);

    this.ring.removeMesh();
    this.cube.removeMesh();
    this.plane.removeMesh();
    // Load the background texture
    var texture = THREE.ImageUtils.loadTexture( 'back.jpg' );
    var backgroundMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2, 0),
        new THREE.MeshBasicMaterial({
            map: texture
        }));

    backgroundMesh .material.depthTest = false;
    backgroundMesh .material.depthWrite = false;

    // this.scene.add(backgroundMesh );

  }

  initPostprocessing() {
    if (!this.usePostprocessing) return;

    this.vignette2Pass = new WAGNER.Vignette2Pass();
  }

  resize(width, height) {
    this.composer.setSize(width, height);

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  };

  render() {
    if (this.usePostprocessing) {
      this.composer.reset();
      this.composer.renderer.clear();
      this.composer.render(this.scene, this.camera);
      this.composer.pass(this.vignette2Pass);
      this.composer.toScreen();
    } else {
      this.renderer.autoClear = false;
      this.renderer.clear();
      this.renderer.render(this.scene, this.camera);
    }

    let audiData = this.audio.getAudioData();

    if(this.plane.active)
      this.plane.update(audiData);
    // if(this.sphere_m1.active)
    //   this.sphere_m1.update(audiData);
    // if(this.sphere.active)
    //   this.sphere.update(audiData);
    // if(this.sphere2.active)
    //   this.sphere2.update(audiData);
    // if(this.sphere3.active)
    //   this.sphere3.update(audiData);
    if(this.cube.active)
      this.cube.update(audiData);
    if(this.cube2.active)
      this.cube2.update(audiData);
    if(this.cube3.active)
      this.cube3.update(audiData);
    // if(this.ring)
    //   this.ring.update(audiData);
  }
}
