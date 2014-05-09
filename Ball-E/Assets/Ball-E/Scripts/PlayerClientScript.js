#pragma strict

private var dir : Vector2;
private var prev : Vector2;

function Start () {

}

function Update () {
	if (Network.isClient && networkView.isMine) {
		dir.x = -Input.acceleration.y;
		dir.y = Input.acceleration.x;
		if (dir != prev) {
			networkView.RPC("UpdateMovement", RPCMode.Server, dir.x, dir.y);
			prev = dir;
		}
	}
}