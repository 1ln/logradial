let w,h;

let canvas,context;

let renderer;
let render;
let uniforms;

let nhash,hash;  

let cam,scene,geometry,mesh,mat;

let rotations;
let dif;

let clock;

function init() {

    canvas  = $('#canvas')[0];
    context = canvas.getContext('webgl2',{ antialias:false });

    w = window.innerWidth;
    h = window.innerHeight; 

    canvas.width  = w;
    canvas.height = h;

    renderer = new THREE.WebGLRenderer({canvas:canvas,context:context});

    cam = new THREE.PerspectiveCamera(45.,w/h,0.0,1.0);

    clock = new THREE.Clock(); 

    nhash = new Math.seedrandom();
    hash = nhash();

    rotations = Math.round(nhash() * 75) + 45;
    dif = new THREE.Color(nhash(),nhash(),nhash());
    
    cam.position.set(25.0,45.0,125.0);

    scene = new THREE.Scene();
    geometry = new THREE.PlaneBufferGeometry(2,2);

    uniforms = {

        "u_time"       : { value : 1.0 },
        "u_resolution" : new THREE.Uniform(new THREE.Vector2(w,h)),
        "u_dif"        : new THREE.Uniform(new THREE.Vector3(dif)),
        "u_rotations"  : { value: rotations },
        "u_hash"       : { value: hash }

    };   

}

init();

ShaderLoader("render.vert","logradial.frag",

    function(vertex,fragment) {

        material = new THREE.ShaderMaterial({

            uniforms : uniforms,
            vertexShader : vertex,
            fragmentShader : fragment

        });

        mesh = new THREE.Mesh(geometry,material);

        scene.add(mesh);
       
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(w,h);

        render = function(timestamp) {

        requestAnimationFrame(render);
    
        uniforms["u_time"     ].value = performance.now();
        uniforms["u_dif"      ].value = dif;
        uniforms["u_rotations"].value = rotations;
        uniforms["u_hash"     ].value = hash;

        renderer.render(scene,cam);

        } 
       
    render();
    })
