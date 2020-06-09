/**
 * 
 *  Euler_angles: https://en.wikipedia.org/wiki/Euler_angles
 *  Dot_product: https://en.wikipedia.org/wiki/Dot_product
 * */
import { useRef } from 'react';
import * as THREE from 'three';
import { useUpdate } from 'react-three-fiber';

// decal geometry
const decalGeometry = ({mesh, position, orientation, size}) => {
  // const geoRef = useRef();
  // buffers
  let vertices = [], normals = [], uvs = []; // TODO
  // helps
  let plane = new THREE.Vector3();
  // this matrix represents the transformation of the decal projector
  const projectorMatrix = new THREE.Matrix4();
  projectorMatrix.makeRotationFromEuler( orientation );
  projectorMatrix.setPosition(position);
  // get matrix inverse
  const projectorMatrixInverse = new Matrix4().getInverse(projectorMatrix);
  const geoRef = useUpdate((geometry) => {
    geometry.addAttribute('position', new Float32BufferAttribute(vertices,3));
    geometry.attributes.position.needsUpdate = true;
    geometry.setAttribute('normal', new Float32BufferAttribute(normals, 3));
    geometry.attributes.normal.needsUpdate = true;
    geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
    geometry.attributes.uvs.needsUpdate = true;
  });

  const generateBuffers = () => {
    let i;
		let geometry = new THREE.BufferGeometry();
		let decalVertices = [];

		let vertex = new THREE.Vector3();
    let normal = new THREE.Vector3();
    // handle different geometry types
    if (mesh.geometry.isGeometry) {
      geometry.fromGeometry(mesh.geometry);
    } else {
      geometry.copy(mesh.geometry);
    }
    const positionAttribute = geometry.attributes.position;
    const normalAttribute = geometry.attributes.normal;
    // first, create an array of 'DecalVertex' objects
		// three consecutive 'DecalVertex' objects represent a single face
    // this data structure will be later used to perform the clipping
    if (geometry.index !== null) {
      // indexed BufferGeometry
      let index = geometry.index;
			for ( i = 0; i < index.count; i ++ ) {
				vertex.fromBufferAttribute(positionAttribute, index.getX(i));
				normal.fromBufferAttribute(normalAttribute, index.getX(i));
				pushDecalVertex(decalVertices, vertex, normal);
			}
    } else {
      // non-indexed BufferGeometry
      for ( i = 0; i < positionAttribute.count; i ++ ) {
				vertex.fromBufferAttribute( positionAttribute, i );
				normal.fromBufferAttribute( normalAttribute, i );
				// pushDecalVertex(decalVertices, vertex, normal);
			}
    }

    // second, clip the geometry so that it doesn't extend out from the projector
    decalVertices = clipGeometry( decalVertices, plane.set( 1, 0, 0 ) );
		decalVertices = clipGeometry( decalVertices, plane.set( - 1, 0, 0 ) );
		decalVertices = clipGeometry( decalVertices, plane.set( 0, 1, 0 ) );
		decalVertices = clipGeometry( decalVertices, plane.set( 0, - 1, 0 ) );
		decalVertices = clipGeometry( decalVertices, plane.set( 0, 0, 1 ) );
    decalVertices = clipGeometry( decalVertices, plane.set( 0, 0, - 1 ) );
    

  };

  const pushDecalVertex = (decalVertices, vertex, normal) => {
    // transform the vertex to world space, then to projector space
    vertex.applyMatrix4(mesh.matrixWorld);
		vertex.applyMatrix4(projectorMatrixInverse);

		normal.transformDirection(mesh.matrixWorld);

		// decalVertices.push(new DecalVertex(vertex.clone(), normal.clone()));
  }

  const DecalVertex = ( position, normal ) => {
    this.position = position;
    this.normal = normal;
  };

  const clipGeometry = (inVertices, plane) => {
    const outVertices = [];
    const s = 0.5 * Math.abs(size.dot(plane));
    // a single iteration clips one face,
    // which consists of three consecutive 'DecalVertex' objects
    for ( var i = 0; i < inVertices.length; i += 3 ) {

			let v1Out, v2Out, v3Out, total = 0;
			let nV1, nV2, nV3, nV4;

			let d1 = inVertices[ i + 0 ].position.dot( plane ) - s;
			let d2 = inVertices[ i + 1 ].position.dot( plane ) - s;
			let d3 = inVertices[ i + 2 ].position.dot( plane ) - s;

			v1Out = d1 > 0;
			v2Out = d2 > 0;
			v3Out = d3 > 0;

			// calculate, how many vertices of the face lie outside of the clipping plane

			total = ( v1Out ? 1 : 0 ) + ( v2Out ? 1 : 0 ) + ( v3Out ? 1 : 0 );

			switch ( total ) {

				case 0: {

					// the entire face lies inside of the plane, no clipping needed

					outVertices.push( inVertices[ i ] );
					outVertices.push( inVertices[ i + 1 ] );
					outVertices.push( inVertices[ i + 2 ] );
					break;

				}

				case 1: {

					// one vertex lies outside of the plane, perform clipping

					if ( v1Out ) {

						nV1 = inVertices[ i + 1 ];
						nV2 = inVertices[ i + 2 ];
						nV3 = clip( inVertices[ i ], nV1, plane, s );
						nV4 = clip( inVertices[ i ], nV2, plane, s );

					}

					if ( v2Out ) {

						nV1 = inVertices[ i ];
						nV2 = inVertices[ i + 2 ];
						nV3 = clip( inVertices[ i + 1 ], nV1, plane, s );
						nV4 = clip( inVertices[ i + 1 ], nV2, plane, s );

						outVertices.push( nV3 );
						outVertices.push( nV2.clone() );
						outVertices.push( nV1.clone() );

						outVertices.push( nV2.clone() );
						outVertices.push( nV3.clone() );
						outVertices.push( nV4 );
						break;

					}

					if ( v3Out ) {

						nV1 = inVertices[ i ];
						nV2 = inVertices[ i + 1 ];
						nV3 = clip( inVertices[ i + 2 ], nV1, plane, s );
						nV4 = clip( inVertices[ i + 2 ], nV2, plane, s );

					}

					outVertices.push( nV1.clone() );
					outVertices.push( nV2.clone() );
					outVertices.push( nV3 );

					outVertices.push( nV4 );
					outVertices.push( nV3.clone() );
					outVertices.push( nV2.clone() );

					break;

				}

				case 2: {

					// two vertices lies outside of the plane, perform clipping

					if ( ! v1Out ) {

						nV1 = inVertices[ i ].clone();
						nV2 = clip( nV1, inVertices[ i + 1 ], plane, s );
						nV3 = clip( nV1, inVertices[ i + 2 ], plane, s );
						outVertices.push( nV1 );
						outVertices.push( nV2 );
						outVertices.push( nV3 );

					}

					if ( ! v2Out ) {

						nV1 = inVertices[ i + 1 ].clone();
						nV2 = clip( nV1, inVertices[ i + 2 ], plane, s );
						nV3 = clip( nV1, inVertices[ i ], plane, s );
						outVertices.push( nV1 );
						outVertices.push( nV2 );
						outVertices.push( nV3 );

					}

					if ( ! v3Out ) {

						nV1 = inVertices[ i + 2 ].clone();
						nV2 = clip( nV1, inVertices[ i ], plane, s );
						nV3 = clip( nV1, inVertices[ i + 1 ], plane, s );
						outVertices.push( nV1 );
						outVertices.push( nV2 );
						outVertices.push( nV3 );

					}

					break;

				}

				case 3: {

					// the entire face lies outside of the plane, so let's discard the corresponding vertices

					break;

				}

			}

		}

		return outVertices;
  };

  return (
    <bufferGeometry attach="geometry" ref={geoRef}></bufferGeometry>
  );
};

export {
  decalGeometry,
}
