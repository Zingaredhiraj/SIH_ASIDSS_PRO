'use client'
import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Asset3D } from '@/lib/types'

const BUILDINGS: Asset3D[] = [
  { asset_id: 'bldg-1', station_id: 'maitri', parent_area: 'Zone A', name: 'Main Habitation Block', type: 'STRUCTURE', model_ref: 'box', position: { x: 0, y: 1.5, z: 0 } },
  { asset_id: 'bldg-2', station_id: 'maitri', parent_area: 'Zone A', name: 'Generator Room', type: 'POWER', model_ref: 'box', position: { x: 14, y: 1.25, z: 0 } },
  { asset_id: 'bldg-3', station_id: 'maitri', parent_area: 'Zone B', name: 'Fuel Storage Tank 1', type: 'STORAGE', model_ref: 'cylinder', position: { x: 14, y: 1.5, z: 8 } },
  { asset_id: 'bldg-4', station_id: 'maitri', parent_area: 'Zone B', name: 'Fuel Storage Tank 2', type: 'STORAGE', model_ref: 'cylinder', position: { x: 18, y: 1.5, z: 8 } },
  { asset_id: 'bldg-5', station_id: 'maitri', parent_area: 'Zone A', name: 'Science Laboratory', type: 'STRUCTURE', model_ref: 'box', position: { x: -12, y: 1.25, z: 0 } },
  { asset_id: 'bldg-6', station_id: 'maitri', parent_area: 'Zone C', name: 'Satellite Comms Dome', type: 'COMMS', model_ref: 'sphere', position: { x: 0, y: 4, z: -14 } },
]

export default function StationScene({
  stationId,
  onSelectAsset
}: {
  stationId: string
  onSelectAsset: (a: Asset3D) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredAsset, setHoveredAsset] = useState<string | null>(null)
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth
    const height = container.clientHeight

    // 1. Scene & Camera
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#0a0e1a')
    scene.fog = new THREE.FogExp2('#0a0e1a', 0.015)

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(24, 18, 24)

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    container.appendChild(renderer.domElement)

    // 3. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.maxPolarAngle = Math.PI / 2 - 0.05
    controls.minDistance = 8
    controls.maxDistance = 70
    controls.target.set(0, 0, 0)

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xdff0ff, 0.6)
    scene.add(ambientLight)

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.2)
    sunLight.position.set(20, 30, 20)
    sunLight.castShadow = true
    scene.add(sunLight)

    const blueFill = new THREE.DirectionalLight(0x00d4ff, 0.5)
    blueFill.position.set(-20, 15, -20)
    scene.add(blueFill)

    // 5. Terrain (Snow & Grid)
    const terrainGeo = new THREE.PlaneGeometry(120, 120, 32, 32)
    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x111e33,
      roughness: 0.9,
      metalness: 0.1
    })
    const terrain = new THREE.Mesh(terrainGeo, terrainMat)
    terrain.rotation.x = -Math.PI / 2
    terrain.receiveShadow = true
    scene.add(terrain)

    const grid = new THREE.GridHelper(120, 40, 0x00d4ff, 0x1a3a5c)
    grid.position.y = 0.02
    scene.add(grid)

    // 6. Buildings & Meshes
    const interactiveMeshes: { mesh: THREE.Mesh; asset: Asset3D }[] = []

    BUILDINGS.forEach((b) => {
      let geo: THREE.BufferGeometry
      if (b.type === 'COMMS') {
        geo = new THREE.SphereGeometry(2, 24, 24)
      } else if (b.type === 'STORAGE') {
        geo = new THREE.CylinderGeometry(1.8, 1.8, 3, 24)
      } else if (b.name === 'Main Habitation Block') {
        geo = new THREE.BoxGeometry(10, 3, 7)
      } else {
        geo = new THREE.BoxGeometry(6, 2.5, 5)
      }

      const mat = new THREE.MeshStandardMaterial({
        color: b.type === 'POWER' ? 0x2d3748 : b.type === 'STORAGE' ? 0x4a5568 : 0x1a365d,
        metalness: 0.3,
        roughness: 0.6
      })

      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(b.position.x, b.position.y, b.position.z)
      mesh.castShadow = true
      mesh.receiveShadow = true
      mesh.userData = { asset: b }
      scene.add(mesh)

      interactiveMeshes.push({ mesh, asset: b })
    })

    // 7. Wind Turbines
    const turbineBlades: THREE.Group[] = []
    const turbinePositions = [
      [-18, 0, 12],
      [-18, 0, 18],
      [-18, 0, 24]
    ]

    turbinePositions.forEach(([tx, ty, tz]) => {
      const mastGeo = new THREE.CylinderGeometry(0.2, 0.4, 7, 16)
      const mastMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8 })
      const mast = new THREE.Mesh(mastGeo, mastMat)
      mast.position.set(tx, ty + 3.5, tz)
      scene.add(mast)

      const hub = new THREE.Group()
      hub.position.set(tx, ty + 7, tz + 0.3)

      for (let i = 0; i < 3; i++) {
        const bladeGeo = new THREE.BoxGeometry(0.18, 2.8, 0.05)
        const bladeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0 })
        const blade = new THREE.Mesh(bladeGeo, bladeMat)
        blade.position.y = 1.4
        const bladeHolder = new THREE.Group()
        bladeHolder.rotation.z = (i * Math.PI * 2) / 3
        bladeHolder.add(blade)
        hub.add(bladeHolder)
      }

      scene.add(hub)
      turbineBlades.push(hub)
    })

    // 8. Raycaster for Interaction
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const onPointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(
        interactiveMeshes.map((i) => i.mesh)
      )

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh
        const asset = hit.userData.asset as Asset3D
        setHoveredAsset(asset.name)
        setHoverPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
        renderer.domElement.style.cursor = 'pointer'
      } else {
        setHoveredAsset(null)
        renderer.domElement.style.cursor = 'default'
      }
    }

    const onClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(
        interactiveMeshes.map((i) => i.mesh)
      )

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh
        const asset = hit.userData.asset as Asset3D
        onSelectAsset(asset)
      }
    }

    renderer.domElement.addEventListener('mousemove', onPointerMove)
    renderer.domElement.addEventListener('click', onClick)

    // 9. Resize handler
    const onResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    // 10. Animation Loop
    let animationFrameId: number
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      // Rotate turbine blades
      turbineBlades.forEach((hub) => {
        hub.rotation.z += 0.04
      })

      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', onResize)
      renderer.domElement.removeEventListener('mousemove', onPointerMove)
      renderer.domElement.removeEventListener('click', onClick)
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [stationId, onSelectAsset])

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden select-none">
      {hoveredAsset && (
        <div
          className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-12 bg-navy-900/90 border border-ice-400 text-white font-mono text-xs px-2.5 py-1 rounded shadow-lg backdrop-blur"
          style={{ left: hoverPos.x, top: hoverPos.y }}
        >
          {hoveredAsset}
        </div>
      )}
    </div>
  )
}
