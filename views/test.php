<ul>
		<br>
		<div>
			<h1 onclick="clickshow(this,'file')">FILE(<%=file_list.length%>)</h1>
			<div id='file' style="display:none">
				<% for(var i = 0; i < file_list.length; i++){%>
				<li>
					<% var path = "/download/" + timestamp + '/' + pid%>
					<% var file_name = file_list[i][0].replace(/\\/gi,'/').split("/").pop();%>
					<%=file_list[i][1]%>&nbsp;&nbsp;&nbsp;<a href="<%=path%>/<%=file_name%>"><%=file_list[i][0]%></a>&nbsp;&nbsp;&nbsp;<%=file_list[i][2]%>byte
					<!-- file_list[i][0] : timestamp, file_list[i][1] : 파일명, file_list[i][2]파일크기(바이트단위로 뽑았지만 가능하면 키로면 키로, 메가단위면 메가, 기가단위로 넘어가면 기가단위로 부탁드립니다-->
				</li>
				<% } %>
			</div>
		</div>
		<br>
		<div>
			<h1 onclick="clickshow(this, 'process')">PROCESS(<%=process_list.length + memory_list.length%>)</h1>
			<div id='process' style="display:none">
				<li>
					<h2 onclick="clickshow(this, 'createprocess')">Create Process(<%=process_list.length%>)</h2>
				</li>
				<div id='createprocess' style="display:none">
					<ul>
						<% for(var i = 0; i < process_list.length; i++){%>
						<li>
							<a href='<%=process_list[i][0]%>?parent=<%=pid%>'><%=process_list[i][0]%></a>&nbsp;&nbsp;<%=process_list[i][1]%>&nbsp;&nbsp;<%=process_list[i][2]%>
							<!-- process_list[i][0] : pid, process_list[i][1] : 실행파일명, process_list[i][2] 프로세스를 실행하는데 사용된 명령어-->
						</li>
						<% } %>
					</ul>
				</div>
				<li>
					<h2 onclick="clickshow(this, 'writememory')">Write Memory(<%=memory_list.length%>)</h2>
				</li>
				<div id='writememory' style="display:none">
					<ul>
						<% for(var i = 0; i < memory_list.length; i++){%>
						<li>
							<%=memory_list[i][0]%>&nbsp;&nbsp;<%=memory_list[i][1]%>&nbsp;&nbsp;<%=memory_list[i][2]%>
							<!--memory_list[i][0] : 메모리를 쓴 대상 프로세스의 pid, memory_list[i][1] : 메모리를 쓴 대상 프로세스의 기준주소-->
							<!--memory_list[i][2] : 메모리 버퍼값인데 아스키 범위에 벗어나는 버퍼를 쓸 가능성이 있으므로 소켓에서 패킷 출력해줄때와 비슷하게 해야할듯합니다.-->
						</li>
						<% } %>
					</ul>
				</div>
			</div>
		</div>
		<br>
		<div>
			<%var reg_cnt = createreg_list.length+setvaluereg_list.length+deletekeyreg_list.length+deletevaluereg_list.length%>
			<h1 onclick="clickshow(this, 'registry')">Registry(<%=reg_cnt%>)</h1>
			<div id='registry' style="display:none">
				<li>
					<h2 onclick="clickshow(this, 'createregistry')">Create Registry Key(<%=createreg_list.length%>)</h2>
				</li>
				<div id='createregistry' style="display:none">
					<ul>
						<% for(var i = 0; i < createreg_list.length; i++){%>
						<li>
							<%=createreg_list[i][0]%>&nbsp;&nbsp;<%=createreg_list[i][1]%>\<%=createreg_list[i][2]%>
							<!--createreg_list[i][0] : 레지스트리 생성시간, createreg_list[i][1] : 레지스트리 하이브, createreg_list[i][2] 레지스트리 경로-->
						</li>
						<% } %>
					</ul>
				</div>
				<li>
					<h2 onclick="clickshow(this, 'setregistry')">Set Registry Value(<%=setvaluereg_list.length%>)</h2>
				</li>
				<div id='setregistry' style="display:none">
					<ul>
						<% for(var i = 0; i < setvaluereg_list.length; i++){%>
						<li>
							<%=setvaluereg_list[i][0]%>&nbsp;&nbsp;<%=setvaluereg_list[i][1]%>\<%=setvaluereg_list[i][2]%>
							&nbsp;&nbsp;<%=setvaluereg_list[i][3]%>&nbsp;&nbsp;<%=setvaluereg_list[i][4]%>
							<!--setvaluereg_list[i][0] : 레지스트리 생성시간, setvaluereg_list[i][1] : 레지스트리 하이브, setvaluereg_list[i][2] : 레지스트리 경로-->
							<!--setvaluereg_list[i][3] : 레지스트리 키, setvaluereg_list[i][4] : 레지스트리 값-->
						</li>
						<% } %>
					</ul>
				</div>
				<li>
					<h2 onclick="clickshow(this, 'deleteregistrykey')">Delete Registry Key(<%=deletekeyreg_list.length%>)
					</h2>
				</li>
				<div id='deleteregistrykey' style="display:none">
					<ul>
						<% for(var i = 0; i < deletekeyreg_list.length; i++){%>
						<li>
							<%=deletekeyreg_list[i][0]%>&nbsp;&nbsp;<%=deletekeyreg_list[i][1]%>\<%=deletekeyreg_list[i][2]%>
							\<%=deletekeyreg_list[i][3]%>
							<!--deletekeyreg_list[i][0] : 레지스트리 생성시간, deletekeyreg_list[i][1] : 레지스트리 하이브, deletekeyreg_list[i][2] : 레지스트리 경로-->
							<!--deletekeyreg_list[i][3] : 삭제될 레지스트리 키-->
						</li>
						<% } %>
					</ul>
				</div>
				<li>
					<h2 onclick="clickshow(this, 'deleteregistryvalue')">Delete Registry
						Value(<%=deletevaluereg_list.length%>)</h2>
				</li>
				<div id='deleteregistryvalue' style="display:none">
					<ul>
						<% for(var i = 0; i < deletevaluereg_list.length; i++){%>
						<li>
							<%=deletevaluereg_list[i][0]%>&nbsp;&nbsp;<%=deletevaluereg_list[i][1]%>\<%=deletevaluereg_list[i][2]%>
							&nbsp;&nbsp;<%=deletevaluereg_list[i][3]%>
							<!--deletevaluereg_list[i][0] : 레지스트리 생성시간, deletevaluereg_list[i][1] : 레지스트리 하이브, deletevaluereg_list[i][2] : 레지스트리 경로-->
							<!--deletevaluereg_list[i][3] : 삭제될 레지스트리 값-->
						</li>
						<% } %>
					</ul>
				</div>
			</div>
		</div>
		<br>
		<%var packet_cnt = 0;%>
		<div>
			<h1 onclick="clickshow(this, 'socket')">Socket(<%=connect_list.length%>)</h1>
			<div id="socket" style="display:none">
				<% for(var i = 0; i < connect_list.length; i++){%>
				<li>
					<% var block = "block" + String(i);%>
					<h3 onclick="clickshow(this,'<%=block%>')">
						<%=connect_list[i][0]%>&nbsp;&nbsp;<%=connect_list[i][1]%>:<%=connect_list[i][2]%>&nbsp;&nbsp;<%=connect_list[i][3]%>
						<!--connect_list[i][0] : 필요없는값, connect_list[i][1] : ip, connect_list[i][2] : port, connect_list[i][3] : 연결성공여부-->
					</h3>
					<ul id=<%=block%> style="display:none">
						<% if(connect_list[i].length > 4){%>
						<% for(var j = 4; j < connect_list[i].length; j++){%>
						<li>
							<div id="myBtn<%=packet_cnt%>" onclick="modal(<%=packet_cnt%>)">
								<%=connect_list[i][j][3]%>&nbsp;&nbsp;<%=connect_list[i][j][0]%>&nbsp;&nbsp;<%=connect_list[i][j][1]%>
								<!-- connect_list[i][j][0] : api명, connect_list[i][j][1] : 패킷길이, connect_list[i][j][3] 패킷전송시간-->
							</div>
							<!-- The Modal -->
							<div id="myModal<%=packet_cnt%>" class="modal<%=packet_cnt%>">

								<!-- Modal content -->
								<div class="modal-content<%=packet_cnt%>">
									<span class="close<%=packet_cnt%>">&times;</span>
									<% var path = "/packet/" + timestamp + '/' + String(pid) + '/' + packet_cnt%>
									<div id="packet<%=packet_cnt%>">

								</div>

								</div>

							</div>
							<% packet_cnt = packet_cnt + 1 %>
						</li>
						<br>
						<%}%>
	                <% } %>
					</ul>
				</li>
				<% } %>
			</div>
		</div>
		<br>
		<div>
			<%var svc_cnt = createservice_list.length+startservice_list.length+deleteservice_list.length+controlservice_list.length%>
			<h1 onclick="clickshow(this, 'service')">Service(<%=svc_cnt%>)</h1>
			<div id='service' style="display:none">
				<li>
					<h2 onclick="clickshow(this, 'createservice')">Create Service(<%=createservice_list.length%>)</h2>
				</li>
				<div id='createservice' style="display:none">
					<ul>
						<% for(var i = 0; i < createservice_list.length; i++){%>
						<li>
							<%=createservice_list[i][0]%>&nbsp;&nbsp;<%=createservice_list[i][2]%>&nbsp;&nbsp;
							<%=createservice_list[i][3]%>
							<!--//createservice_list[i][0] : 서비스 생성시간, createservice_list[i][1] : 서비스 핸들값, createservice_list[i][2] : 서비스명-->
							<!--//createservice_list[i][3] : 서비스 바이너리 경로  -->
						</li>
						<% } %>
					</ul>
				</div>
				<li>
					<h2 onclick="clickshow(this, 'startservice')">Start Service(<%=startservice_list.length%>)</h2>
				</li>
				<div id='startservice' style="display:none">
					<ul>
						<% for(var i = 0; i < startservice_list.length; i++){%>
						<li>
							<%=startservice_list[i][0]%>&nbsp;&nbsp;<%=startservice_list[i][1]%>
							<!--//startservice_list[i][0] : 서비스 시작시간, startservice_list[i][1] : 서비스명-->
						</li>
						<% } %>
					</ul>
				</div>
				<li>
					<h2 onclick="clickshow(this, 'deleteservice')">Delete Service(<%=deleteservice_list.length%>)</h2>
				</li>
				<div id='deleteservice' style="display:none">
					<ul>
						<% for(var i = 0; i < deleteservice_list.length; i++){%>
						<li>
							<%=deleteservice_list[i][0]%>&nbsp;&nbsp;<%=deleteservice_list[i][1]%>
							<!--//deleteservice_list[i][0] : 서비스 삭제시간, deleteservice_list[i][1] : 서비스명-->
						</li>
						<% } %>
					</ul>
				</div>
				<li>
					<h2 onclick="clickshow(this, 'controlservice')">Control Service(<%=controlservice_list.length%>)</h2>
				</li>
				<div id='controlservice' style="display:none">
					<ul>
						<% for(var i = 0; i < controlservice_list.length; i++){%>
						<li>
							<%=controlservice_list[i][0]%>&nbsp;&nbsp;<%=controlservice_list[i][1]%>
							&nbsp;&nbsp;<%=controlservice_list[i][2]%>
							<!--//controlservice_list[i][0] : 서비스 조정시간, controlservice_list[i][1] : 서비스명-->
								<!--//controlservice_list[i][2] : 서비스 조정종류(Stop, Pause, Restart) -->
									<!--//조정 종류에 따라 서비스가 정지, 중지, 재시작을 표현해주셔야 합니다.-->
						</li>
						<% } %>
					</ul>
				</div>
			</div>
		</div>
	</ul>
	<script type="text/javascript">
		tree_json = {
			chart: { container: '#tree-simple' },
			nodeStructure: {
				text: { name: '7680' },
				children: [
					{ text: { name: '1756' } },
					{ text: { name: '6744' } },
					{ text: { name: '3400' } },
					{ text: { name: '1988' } },
					{ text: { name: '2228' }, children: [{text:{name:3496}},{text:{name:4652}}] },
					{ text: { name: '1320' } },
					{ text: { name: '5332' } },
					{ text: { name: '8036' } },
					{ text: { name: '1540' } },
					{ text: { name: '2148' } }
				]
			}
		}
		var my_chart = new Treant(tree_json);
		//<![CDATA[
		function clickshow(elem, ID) {
			var menu = document.getElementById(ID);
			if (elem.className != 'closed') {
				elem.className = 'closed';
				menu.style.display = "none";
			} else {
				elem.className = 'opened';
				menu.style.display = "block";
			}
		}
	    //]]>
		function modal(cnt) {
			var modal = document.getElementById('myModal' + String(cnt));

			var btn = document.getElementById("myBtn" + String(cnt));

			var span = document.getElementsByClassName("close" + String(cnt))[0];

			btn.onclick = function () {
				modal.style.display = "block";
			}

			span.onclick = function () {
				modal.style.display = "none";
			}

			window.onclick = function (event) {
				if (event.target == modal) {
					modal.style.display = "none";
				}
			}

			var div = document.createElement('div' + String(cnt));

			div.className = 'row';
	        <% var path = "/packet/" + timestamp + '/' + String(pid) + '?packetNum=' %>
				div.innerHTML = '<iframe src=<%=path%>' + cnt + ' frameborder = 0 framespacing = 0 marginheight = 0 marginwidth = 0 width="100%" height="50%"></iframe>';

			document.getElementById('packet' + String(cnt)).appendChild(div);
		}
	</script>
	<style>
	<%for(var i=0; i < packet_cnt; i++) {
		%>.modal<%=i%> {
			display: none;
			/* Hidden by default */
			position: fixed;
			/* Stay in place */
			z-index: 1;
			/* Sit on top */
			left: 0;
			top: 0;
			width: 100%;
			/* Full width */
			height: 100%;
			/* Full height */
			overflow: auto;
			/* Enable scroll if needed */
			background-color: rgb(0, 0, 0);
			/* Fallback color */
			background-color: rgba(0, 0, 0, 0.4);
			/* Black w/ opacity */
		}

		/* Modal Content/Box */
		.modal-content<%=i%> {
			background-color: #fefefe;
			margin: 15% auto;
			/* 15% from the top and centered */
			padding: 20px;
			border: 1px solid #888;
			width: 60%;
			/* Could be more or less, depending on screen size */
			color: black;
		}

		/* The Close Button */
		.close<%=i%> {
			color: #aaa;
			float: right;
			font-size: 28px;
			font-weight: bold;
		}

		.close<%=i%>:hover,
		.close<%=i%>:focus {
			color: black;
			text-decoration: none;
			cursor: pointer;
		}

		<%
	}

	%>
	</style>