#pragma strict

private var powerupTimer : float;
private var respawnTimer : float;

private var dir : Vector3 = Vector3.zero;
private var speed : int;
private var circ : float;
private var previousPosition : Vector3;

function Start () {
	renderer.material.color = ColorHSV(Random.Range(0.0, 360.0), 1.0, 1.0).ToColor();
	Input.compensateSensors = false;
	circ = 2 * Mathf.PI * collider.bounds.extents.x;	
	previousPosition = transform.position;

	powerupTimer = 0.0;
	respawnTimer = 0.0;
	speed = 500;
}

function Update () {
	if (Network.isServer) {
		if (networkView.isMine) {
			dir.x = -Input.acceleration.y;
			dir.z = Input.acceleration.x;
		}

		if (respawnTimer > 0) {
			respawnTimer -= Time.deltaTime;
			if (respawnTimer <= 0) {
				respawnTimer = 0.0;
				Respawn();
			}
		}
		else if (transform.position.y < -2.0) {
			Death();
		}
		else if (powerupTimer > 0) {
			powerupTimer -= Time.deltaTime;
			rigidbody.AddForce(dir * speed * Time.deltaTime * 1.5);
			if (powerupTimer <= 0) {
				powerupTimer = 0.0;
				GetComponent(TrailRenderer).enabled = false;
			}
		}
		else {
			rigidbody.AddForce(dir * speed * Time.deltaTime);
		}
	}
}

function LateUpdate() {
	var movement : Vector3 = transform.position - previousPosition;
	movement = Vector3(movement.z,0,  -movement.x);
	transform.Rotate(movement / circ * 360, Space.World);
	previousPosition = transform.position;	
}

function Death() {
	respawnTimer += 5.0;
	GetComponent(TrailRenderer).enabled = false;
	rigidbody.constraints = RigidbodyConstraints.FreezeAll;
	GetComponent(explosion).Boom();
	
	yield WaitForSeconds(1);
	
	transform.position = Vector3(Random.Range(50,100), Random.Range(50,100), Random.Range(50,100));
}

function Respawn() {
	transform.position = GetRandomSpawnPoint();
	transform.rotation = Quaternion.identity;
	rigidbody.velocity = Vector3.zero;
	rigidbody.constraints = RigidbodyConstraints.None;
	renderer.enabled = true;
}

function GetRandomSpawnPoint() : Vector3 {
	var validPoint : boolean = false;
	while (!validPoint) {
		var location : Vector3 = Vector3(Mathf.Abs(Random.Range(0,8)) * 6 + 1, 2, Mathf.Abs(Random.Range(0,8)) * 6 - 1);
		if (Physics.OverlapSphere(location, 1.5).Length == 1) {
			location.y += 1.5;
			return location;
		}
	}
	return Vector3(5, 3.5, 4);
}

function OnCollisionEnter(col : Collision) {
	if (col.gameObject.name == "Powerup(Clone)") {
		Destroy(col.gameObject);
		powerupTimer += 5.0;
		GetComponent(TrailRenderer).enabled = true;
	}
	if (col.gameObject.name == "Cyclone(Clone)") {
		rigidbody.velocity *= -3;
	}
	if (col.gameObject.name == "Spike") {
		Death();
	}
}

@RPC
function UpdateMovement(x : float, z : float) {
	dir.x = x;
	dir.z = z;
}