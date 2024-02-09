import ReactThreeTestRenderer from '@react-three/test-renderer'

describe('DataPoint Creation and Interaction', () => {
    test('creating a basic DataPoint', async () => {
        const renderer = await ReactThreeTestRenderer.create(
            <mesh>
                <boxGeometry args={[2, 2]} />
                <meshStandardMaterial args={[{color: 0x0000ff,},]} />
            </mesh>
        )

        expect((renderer.scene.children.length)).toEqual(1)
    });
})