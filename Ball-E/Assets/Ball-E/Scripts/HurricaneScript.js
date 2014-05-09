#pragma strict

private var timer : float;

function Start() {
	timer = 10.0;
}

function Update () {
	var dir : Vector2 = Random.insideUnitCircle;
	var direction : Vector3 = Vector3(dir.x, 0, dir.y);
	transform.Translate(direction * Time.deltaTime * 20, Space.World);
	
	timer -= Time.deltaTime;
	if (timer < 0) {
		Destroy(gameObject);
	}
}