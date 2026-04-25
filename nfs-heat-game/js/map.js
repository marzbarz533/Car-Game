// City Map Generator
class CityMap {
    constructor(scene, physicsEngine) {
        this.scene = scene;
        this.physics = physicsEngine;
        this.buildings = [];
        this.roads = [];
        this.mapSize = 3000;
        this.blockSize = 200;
    }

    generateCity() {
        // Create road network
        this.generateRoads();
        
        // Create buildings
        this.generateBuildings();
        
        // Create street lighting
        this.generateLights();
        
        // Create collision walls for buildings
        this.generateCollisionWalls();

        console.log('City generated with ' + this.buildings.length + ' buildings');
    }

    generateRoads() {
        const roadMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.8,
            metalness: 0.1
        });

        const roadLines = new THREE.MeshStandardMaterial({
            color: 0xffff00,
            emissive: 0xffff00,
            emissiveIntensity: 0.3
        });

        // Create grid of roads
        const gridCount = Math.ceil(this.mapSize / this.blockSize);
        const roadWidth = 30;

        for (let i = -gridCount / 2; i < gridCount / 2; i++) {
            const x = i * this.blockSize;
            
            // Horizontal roads
            const roadH = new THREE.Mesh(
                new THREE.PlaneGeometry(this.mapSize, roadWidth),
                roadMaterial
            );
            roadH.rotation.x = -Math.PI / 2;
            roadH.position.set(0, 0, x);
            roadH.receiveShadow = true;
            this.scene.add(roadH);
            this.roads.push(roadH);

            // Add road markings
            const markingsCount = Math.floor(this.mapSize / 100);
            for (let j = -markingsCount / 2; j < markingsCount / 2; j++) {
                const marking = new THREE.Mesh(
                    new THREE.PlaneGeometry(15, 3),
                    roadLines
                );
                marking.rotation.x = -Math.PI / 2;
                marking.position.set(j * 100, 0.01, x);
                this.scene.add(marking);
            }

            // Vertical roads
            const roadV = new THREE.Mesh(
                new THREE.PlaneGeometry(roadWidth, this.mapSize),
                roadMaterial
            );
            roadV.rotation.x = -Math.PI / 2;
            roadV.position.set(x, 0, 0);
            roadV.receiveShadow = true;
            this.scene.add(roadV);
            this.roads.push(roadV);
        }
    }

    generateBuildings() {
        const gridCount = Math.ceil(this.mapSize / this.blockSize);
        const buildingMaterial = new THREE.MeshStandardMaterial({
            color: 0x222222,
            roughness: 0.7,
            metalness: 0.2
        });

        const windowMaterial = new THREE.MeshStandardMaterial({
            color: 0xffaa00,
            emissive: 0xffaa00,
            emissiveIntensity: 0.5
        });

        for (let i = -gridCount / 2; i < gridCount / 2; i++) {
            for (let j = -gridCount / 2; j < gridCount / 2; j++) {
                if (Math.random() > 0.3) { // 70% chance of building
                    const x = i * this.blockSize + this.blockSize * 0.5;
                    const z = j * this.blockSize + this.blockSize * 0.5;
                    const height = 30 + Math.random() * 100;
                    const width = 60 + Math.random() * 40;
                    const depth = 60 + Math.random() * 40;

                    // Building main body
                    const building = new THREE.Mesh(
                        new THREE.BoxGeometry(width, height, depth),
                        buildingMaterial
                    );
                    building.position.set(x, height / 2, z);
                    building.castShadow = true;
                    building.receiveShadow = true;
                    this.scene.add(building);
                    this.buildings.push(building);

                    // Add windows
                    const windowsX = Math.floor(width / 15);
                    const windowsY = Math.floor(height / 15);
                    const windowsZ = Math.floor(depth / 15);

                    for (let wx = 0; wx < windowsX; wx++) {
                        for (let wy = 0; wy < windowsY; wy++) {
                            for (let wz = 0; wz < windowsZ; wz++) {
                                if (Math.random() > 0.3) {
                                    const window = new THREE.Mesh(
                                        new THREE.BoxGeometry(8, 8, 2),
                                        windowMaterial
                                    );
                                    window.position.set(
                                        x - width / 2 + wx * 15 + 7.5,
                                        height / 2 - height / 2 + wy * 15 + 7.5,
                                        z - depth / 2 + wz * 15 + 1
                                    );
                                    window.castShadow = true;
                                    this.scene.add(window);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    generateLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        // Main directional light (sun)
        const sunLight = new THREE.DirectionalLight(0xffffff, 1);
        sunLight.position.set(500, 1500, 500);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 4096;
        sunLight.shadow.mapSize.height = 4096;
        sunLight.shadow.camera.far = 5000;
        sunLight.shadow.camera.left = -this.mapSize / 2;
        sunLight.shadow.camera.right = this.mapSize / 2;
        sunLight.shadow.camera.top = this.mapSize / 2;
        sunLight.shadow.camera.bottom = -this.mapSize / 2;
        this.scene.add(sunLight);

        // Street lights
        const streetLightCount = Math.floor(this.mapSize / 200);
        for (let i = -streetLightCount; i < streetLightCount; i++) {
            for (let j = -streetLightCount; j < streetLightCount; j++) {
                const light = new THREE.PointLight(0xff6600, 50, 200);
                light.position.set(i * 200, 40, j * 200);
                light.castShadow = true;
                this.scene.add(light);
            }
        }
    }

    generateCollisionWalls() {
        const gridCount = Math.ceil(this.mapSize / this.blockSize);

        for (let i = -gridCount / 2; i < gridCount / 2; i++) {
            for (let j = -gridCount / 2; j < gridCount / 2; j++) {
                if (Math.random() > 0.3) {
                    const x = i * this.blockSize + this.blockSize * 0.5;
                    const z = j * this.blockSize + this.blockSize * 0.5;
                    const height = 30 + Math.random() * 100;
                    const width = 60 + Math.random() * 40;
                    const depth = 60 + Math.random() * 40;

                    this.physics.createWall(
                        { x: x, y: height / 2, z: z },
                        { x: width, y: height, z: depth }
                    );
                }
            }
        }
    }

    // Get a safe spawn point on the road
    getSpawnPoint() {
        return {
            x: 0,
            y: 10,
            z: 0
        };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CityMap;
}
