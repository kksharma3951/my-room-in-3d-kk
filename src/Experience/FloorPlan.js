import * as THREE from 'three'
import Experience from './Experience.js'

export default class FloorPlan
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.debug = this.experience.debug
        this.time = this.experience.time
        
        console.log('FloorPlan constructor called')
        
        // Setup
        this.setFloorPlan()
    }
    
    setFloorPlan()
    {
        console.log('Setting up floor plan')
        
        // Create a group to hold all floor plan elements
        this.floorPlanGroup = new THREE.Group()
        
        // Create a smaller test cube
        const testCube = new THREE.Mesh(
            new THREE.BoxGeometry(2, 2, 2),
            new THREE.MeshBasicMaterial({ 
                color: 0xff0000,
                transparent: true,
                opacity: 0.5 
            })
        )
        // Position it above and to the side of the main room
        testCube.position.set(10, 2, 10)
        this.floorPlanGroup.add(testCube)
        
        // Add to scene
        this.scene.add(this.floorPlanGroup)
        
        console.log('Floor plan added to scene', this.floorPlanGroup)
        
        // Debug
        if(this.debug)
        {
            this.debugFolder = this.debug.addFolder({
                title: 'floorPlan',
                expanded: true
            })
            
            // Position controls for the test cube
            this.debugFolder.addInput(
                testCube.position,
                'x',
                { min: -20, max: 20, step: 0.5, label: 'Cube X' }
            )
            this.debugFolder.addInput(
                testCube.position,
                'y',
                { min: -20, max: 20, step: 0.5, label: 'Cube Y' }
            )
            this.debugFolder.addInput(
                testCube.position,
                'z',
                { min: -20, max: 20, step: 0.5, label: 'Cube Z' }
            )
            
            // Scale control for the test cube
            this.debugFolder.addInput(
                testCube.scale,
                'x',
                { min: 0.1, max: 5, step: 0.1, label: 'Cube Scale' }
            ).on('change', (ev) => {
                testCube.scale.set(ev.value, ev.value, ev.value)
            })
            
            // Opacity control
            this.debugFolder.addInput(
                testCube.material,
                'opacity',
                { min: 0, max: 1, step: 0.1, label: 'Cube Opacity' }
            )
        }
    }
    
    update()
    {
        // Empty update for now
    }
} 