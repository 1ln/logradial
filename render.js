let w,h;

let canvas,context;

let renderer;
let render;
let uniforms;

let nhash,hash;  

let cam,scene,geometry,mesh,mat;

let rotations;

let noise,o1,o2;
let df;
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

    df = Math.round(nhash() *  6) ;

    rotations = Math.round(nhash() * 75) + 8;

    dif = new THREE.Color(nhash(),nhash(),nhash());
    noise = Math.round(nhash() * 5) + 1;
    o1 = Math.round(nhash() * 8) + 2;
    o2 = Math.round(nhash() * 8) + 2;
    
    cam.position.set(5.0,10.0,25.0);

    scene = new THREE.Scene();
    geometry = new THREE.PlaneBufferGeometry(2,2);

    uniforms = {

        "u_time"       : { value : 1.0 },
        "u_resolution" : new THREE.Uniform(new THREE.Vector2(w,h)),
        "u_dif"        : new THREE.Uniform(new THREE.Vector3(dif)),
        "u_noise"      : { value: noise },
        "u_rotations"  : { value: rotations },
        "u_o1"         : { value: o1 },
        "u_o2"         : { value: o2 },
        "u_df"         : { value: df },          
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
        uniforms["u_df"       ].value = df;
        uniforms["u_noise"    ].value = noise; 
        uniforms["u_o1"       ].value = o1;
        uniforms["u_o2"       ].value = o2;
        uniforms["u_dif"      ].value = dif;
        uniforms["u_rotations"].value = rotations;
        uniforms["u_hash"     ].value = hash;

        renderer.render(scene,cam);

        } 
       
    render();
    })
