#pragma strict

private var timer : float = 0.0;
var hurricane : Transform;
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
	nextSpawn = Mathf.Abs(Random.Range(30,40));
	
	var validPoint : boolean = false;
	var tries : int = 0;
	while (!validPoint && tries < 5) {
		var location : Vector3 = Vector3(Mathf.Abs(Random.Range(0,6)) * 6 + 7, 2, Mathf.Abs(Random.Range(0,6)) * 6 + 5);
		if (Physics.OverlapSphere(location, 1.5).Length == 1) {
			var newPowerUp : Transform = Instantiate(hurricane, location, Quaternion.identity);
			validPoint = true;
		}
		tries++;
	}
	
	yield WaitForSeconds(1);
	
	spawning = false;
}