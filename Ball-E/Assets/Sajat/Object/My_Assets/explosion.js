#pragma strict

private var myParticles : ParticleSystem;
 
function Start()
{
    myParticles = GetComponent(ParticleSystem);
    myParticles.Stop();
    myParticles.Clear();
}

function Boom() 
{
        myParticles.Play();
        yield WaitForSeconds(0.1);
		renderer.enabled = false;
}