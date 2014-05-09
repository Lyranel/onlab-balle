#pragma strict

private var timer : float = 0.0;
var powerup : Transform;
private var nextSpawn : float = 10.0;
private var spawning : boolean = false;

function Update() {
	if (!spawning) {
		timer += Time.deltaTime;
	}

	if (timer >= nextSpawn) {
		Spawn();
	}
}

function Spawn() {
	spawning = true;
	timer = 0.0;
	nextSpawn = Mathf.Abs(Random.Range(10,20));
	
	var validPoint : boolean = false;
	var tries : int = 0;
	while (!validPoint && tries < 5) {
		var location : Vector3 = Vector3(Mathf.Abs(Random.Range(0,8)) * 6 + 1, 2, Mathf.Abs(Random.Range(0,8)) * 6 - 1);
		if (Physics.OverlapSphere(location, 1.5).Length == 1) {
			location.y += 1;
			var newPowerUp : Transform = Instantiate(powerup, location, Quaternion.identity);
			validPoint = true;
		}
		tries++;
	}
	
	yield WaitForSeconds(1);
	
	spawning = false;
}