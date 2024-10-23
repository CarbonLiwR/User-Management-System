import { useRef, useEffect } from 'react';
// import Theme from '@/components/home/Theme';

const particleCount = 300;
const particleSpeed = 0.25;
const particleSize = 2;
const maxDistance = 100;
const lightningColor = "#fff";

const CanvasComponent = () => {
    const canvasRef = useRef(null);
    const particles = useRef([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        function setCanvasSize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        setCanvasSize();
        window.addEventListener('resize', setCanvasSize);

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.angle = Math.random() * 2 * Math.PI;
                this.speed = Math.random() * particleSpeed;
                this.opacity = Math.random() * 0.5 + 0.5;
            }

            update() {
                this.x += Math.cos(this.angle) * this.speed;
                this.y += Math.sin(this.angle) * this.speed;

                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                    this.reset();
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, particleSize, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx.fill();
            }
        }

        function createParticles() {
            for (let i = 0; i < particleCount; i++) {
                particles.current.push(new Particle());
            }
        }

        function drawConnections() {
            for (let i = 0; i < particles.current.length; i++) {
                for (let j = i + 1; j < particles.current.length; j++) {
                    const dx = particles.current[i].x - particles.current[j].x;
                    const dy = particles.current[i].y - particles.current[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) {
                        ctx.beginPath();
                        ctx.moveTo(particles.current[i].x, particles.current[i].y);
                        ctx.lineTo(particles.current[j].x, particles.current[j].y);
                        ctx.strokeStyle = lightningColor;
                        ctx.lineWidth = 0.2 * (1 - distance / maxDistance);
                        ctx.stroke();
                        ctx.closePath();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.current.forEach(particle => {
                particle.update();
                particle.draw();
            });

            drawConnections();
            requestAnimationFrame(animate);
        }

        createParticles();
        animate();

        return () => {
            window.removeEventListener('resize', setCanvasSize);
            cancelAnimationFrame(animate);
        };
    }, []);

    return (
        <div className="main-container">
            <canvas id="myCanvas" ref={canvasRef}></canvas>
            <Theme />
        </div>
    );
};

export default CanvasComponent;
