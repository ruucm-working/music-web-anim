'use strict';

import THREE from 'three';
import BaseThreeObj from './BaseThreeObj.js';

export default class Sphere extends BaseThreeObj {
  constructor() {
    super();

    this.initialGeomVertices = [];

    this.geom = new THREE.SphereGeometry(60, 40, 40);

    // alpha texture used to regulate transparency 
    var image = document.createElement('img');
    var alphaMap = new THREE.Texture(image);
    image.onload = function()  {
        alphaMap.needsUpdate = true;
    };
    image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAGUlEQVQoU2NkYGD4z4AHMP7//x+/gmFhAgCXphP14bko/wAAAABJRU5ErkJggg==';

    // this.mat = new THREE.MeshBasicMaterial({
    //   color: 0x07019A,
    //   side: THREE.DoubleSide, 
    //   wireframe: false,
    //   alphamap: alphaMap
    // });
    this.mat = new THREE.MeshBasicMaterial({ color: "#07019A", transparent: true, side: THREE.DoubleSide, alphaTest: 0.5, opacity: 0.8, roughness: 1 });
    // this.mat = new THREE.MeshStandardMaterial({ color: "#444", transparent: true, side: THREE.DoubleSide, alphaTest: 0.5, opacity: 1, roughness: 1 });

    this.active = true;
    this.addMesh();
    this.saveVertices();
  }

  update(audioData) {
    for (let i = 0; i < this.mesh.geometry.vertices.length; i++) {

      this.mesh.geometry.vertices[i].x = this.initialGeomVertices[i].x * (audioData[i] / 100);
      this.mesh.geometry.vertices[i].y = this.initialGeomVertices[i].y * (audioData[i] / 300);
      this.mesh.geometry.vertices[i].z = this.initialGeomVertices[i].z * (audioData[i] / 100);
    }
    this.mesh.geometry.verticesNeedUpdate = true;
  }
}
