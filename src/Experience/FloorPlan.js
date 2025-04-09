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
        
        // Setup
        this.setFloorPlan()
        
        // Debug
        if(this.debug)
        {
            this.debugFolder = this.debug.addFolder({
                title: 'floorPlan',
                expanded: true
            })
            
            this.debugFolder.addInput(
                this.floorPlanGroup.position,
                'x',
                { min: -100, max: 100, step: 1 }
            )
            
            this.debugFolder.addInput(
                this.floorPlanGroup.position,
                'y',
                { min: -100, max: 100, step: 1 }
            )
            
            this.debugFolder.addInput(
                this.floorPlanGroup.position,
                'z',
                { min: -100, max: 100, step: 1 }
            )
            
            this.debugFolder.addInput(
                this.floorPlanGroup.scale,
                'x',
                { min: 0.1, max: 10, step: 0.1 }
            )
            
            this.debugFolder.addInput(
                this.floorPlanGroup.scale,
                'y',
                { min: 0.1, max: 10, step: 0.1 }
            )
            
            this.debugFolder.addInput(
                this.floorPlanGroup.scale,
                'z',
                { min: 0.1, max: 10, step: 0.1 }
            )
        }
    }
    
    setFloorPlan()
    {
        // Define floor plan data - scaled down from the original
        this.floorplanData = {
            "rooms": [
                { "name": "KITCHEN", "coordinates": { "x": 1.0, "y": 6.0, "width": 3.5, "height": 3.0 } },
                { "name": "PWD", "coordinates": { "x": 5.5, "y": 6.0, "width": 2.0, "height": 3.0 } },
                { "name": "LIVING/DINING", "coordinates": { "x": 1.0, "y": 2.0, "width": 6.5, "height": 4.0 } },
                { "name": "BALCONY", "coordinates": { "x": 1.0, "y": 0.5, "width": 5.0, "height": 1.5 } },
                { "name": "MECH.", "coordinates": { "x": 7.0, "y": 1.0, "width": 2.0, "height": 2.5 } },
                { "name": "STORAGE", "coordinates": { "x": 8.0, "y": 8.0, "width": 1.5, "height": 1.5 } }
            ],
            "features": [
                { "name": "STAIRS", "coordinates": { "x": 7.5, "y": 3.5, "width": 1.5, "height": 4.0 } },
                { "name": "PATIO DOOR", "coordinates": { "x": 3.0, "y": 2.0, "width": 2.5, "height": 0.5 } },
                { "name": "BREAKFAST BAR", "coordinates": { "x": 1.5, "y": 5.5, "width": 2.5, "height": 0.5 } },
                { "name": "DW", "coordinates": { "x": 3.5, "y": 7.0, "width": 1.0, "height": 0.5 } }
            ]
        }
        
        // Create a group to hold all floor plan elements
        this.floorPlanGroup = new THREE.Group()
        
        // Position and scale the floor plan to be visible
        this.floorPlanGroup.position.set(0, 0, 0)
        this.floorPlanGroup.scale.set(1.5, 1.5, 1.5)
        
        // Ground plane to make orientation easier
        const groundGeometry = new THREE.PlaneGeometry(15, 15)
        const groundMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x444444,
            side: THREE.DoubleSide
        })
        this.ground = new THREE.Mesh(groundGeometry, groundMaterial)
        this.ground.rotation.x = Math.PI * 0.5
        this.ground.position.set(5, 0, 5)
        this.floorPlanGroup.add(this.ground)
        
        // Create rooms
        this.floorplanData.rooms.forEach(room => {
            this.createRoom(room)
        })
        
        // Create features
        this.floorplanData.features.forEach(feature => {
            this.createFeature(feature)
        })
        
        // Add the floor plan group to the scene
        this.scene.add(this.floorPlanGroup)
        
        console.log('Floor plan added to scene', this.floorPlanGroup)
    }
    
    createRoom(room)
    {
        const { x, y, width, height } = room.coordinates
        
        // Create a box geometry for the room - reduced height to 3
        const geometry = new THREE.BoxGeometry(width, 3, height)
        
        // Use specific colors for different rooms
        let color
        switch(room.name) {
            case "KITCHEN":
                color = new THREE.Color(0x8BECF7) // Light blue
                break
            case "PWD":
                color = new THREE.Color(0xF7D08B) // Light orange
                break
            case "LIVING/DINING":
                color = new THREE.Color(0xA5F78B) // Light green
                break
            case "BALCONY":
                color = new THREE.Color(0xC8A2FF) // Light purple
                break
            case "MECH.":
                color = new THREE.Color(0xFFAAAA) // Light red
                break
            case "STORAGE":
                color = new THREE.Color(0xE5E5E5) // Light gray
                break
            default:
                color = new THREE.Color(0xFFFFFF) // White
        }
        
        // Use MeshBasicMaterial to ensure visibility without lights
        const material = new THREE.MeshBasicMaterial({ 
            color: color,
            transparent: true,
            opacity: 0.8
        })
        
        const mesh = new THREE.Mesh(geometry, material)
        
        // Position the mesh
        mesh.position.set(x + width/2, 1.5, y + height/2) // 1.5 is half of wall height
        
        // Add to group
        this.floorPlanGroup.add(mesh)
        
        // Add text label for room name
        this.addLabel(room.name, x + width/2, 4, y + height/2)
        
        // Add wireframe for better visibility
        const wireframe = new THREE.LineSegments(
            new THREE.EdgesGeometry(geometry),
            new THREE.LineBasicMaterial({ color: 0x000000 })
        )
        wireframe.position.copy(mesh.position)
        this.floorPlanGroup.add(wireframe)
    }
    
    createFeature(feature)
    {
        const { x, y, width, height } = feature.coordinates
        
        // Create a box geometry for the feature - thinner at 0.5 units
        const geometry = new THREE.BoxGeometry(width, 0.5, height)
        
        // Use MeshBasicMaterial for features
        const material = new THREE.MeshBasicMaterial({ 
            color: 0xffff00,
            transparent: true,
            opacity: 0.8
        })
        
        const mesh = new THREE.Mesh(geometry, material)
        
        // Position the mesh, slightly above rooms
        mesh.position.set(x + width/2, 3.2, y + height/2)
        
        // Add to group
        this.floorPlanGroup.add(mesh)
        
        // Add wireframe outline
        const wireframe = new THREE.LineSegments(
            new THREE.EdgesGeometry(geometry),
            new THREE.LineBasicMaterial({ color: 0x000000 })
        )
        wireframe.position.copy(mesh.position)
        this.floorPlanGroup.add(wireframe)
    }
    
    addLabel(text, x, y, z)
    {
        // Create a canvas for the text
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        canvas.width = 256
        canvas.height = 64
        
        // Draw text on canvas - black text for better visibility
        context.fillStyle = '#000000'
        context.font = 'bold 24px Arial'
        context.fillText(text, 10, 40)
        
        // Create texture from canvas
        const texture = new THREE.CanvasTexture(canvas)
        
        // Create a sprite material with the texture
        const material = new THREE.SpriteMaterial({ 
            map: texture,
            transparent: true
        })
        
        // Create a sprite
        const sprite = new THREE.Sprite(material)
        sprite.position.set(x, y, z)
        sprite.scale.set(5, 1.5, 1) // Reduced scale for better fit
        
        // Add to group
        this.floorPlanGroup.add(sprite)
    }
    
    update()
    {
        // Make floor plan visible by adjusting position or rotating
        if(this.floorPlanGroup) {
            // Optional: Add subtle animation to make it more noticeable
            this.floorPlanGroup.rotation.y = Math.sin(this.time.elapsed * 0.0005) * 0.1
        }
    }
} 