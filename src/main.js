window.onload = function() {
  // タスクを用意
  var tasks = [
    {
    	id: 'id1',
    	name: '確定申告する',
    	description: '必ずやる!!',
    	start: '2021-01-01',
    	end: '2021-01-7',
    	progress: 100,
    },
    {
    	id: 'id2',
    	name: 'クライアントに挨拶',
    	description: '年賀状も確認した上で連絡する',
    	start: '2021-01-4',
    	end: '2021-01-8',
    	progress: 100,
    },
    {
    	id: 'id3',
    	name: '請求書作成',
    	description: 'みんなに稼働時間を記録してもらった上で請求を出す',
    	start: '2021-01-5',
    	end: '2021-01-6',
    	progress: 40,
    },
    {
    	id: 'id4',
    	name: '案件A を開発',
    	description: 'まずはフレームワークのアップデートやる!',
    	start: '2021-01-5',
    	end: '2021-01-11',
    	progress: 50,
    },
    {
    	id: 'id5',
    	name: 'フィードバック面談',
    	description: '各メンバーシートを記入してもらった上で 1on1',
    	start: '2021-01-12',
    	end: '2021-01-16',
    	progress: 20,
    },
  ];
  
  // gantt をセットアップ
  var currentTask;
  var createGantt = function() {
	var obj = new Gantt("#gantt", tasks, {
		// ダブルクリック時
		on_click: (task) => {
			console.log(task.description);
		},
		// 日付変更時
		on_date_change: (task, start, end) => {
			console.log(`${task.name}: change date`);
			gantt.modified = true;
			task.start = task._start
			task.end = task._end
		},
		// 進捗変更時
		on_progress_change: (task, progress) => {
			console.log(`${task.name}: change progress to ${progress}%`);
			gantt.modified = true;
		},
		custom_popup_html: (task) => {
			// the task object will contain the updated
			// dates and progress value
			currentTask = task;
			// const end_date = task._end.format('MMM D');
			d = task._end;
			const end_date = (d.getMonth()+1) + '/' + d.getDate();
			d = task._start;
			const start_date = (d.getMonth()+1) + '/' + d.getDate();
			return `
     			<div class="title"><a href="javascript:editTaskName()">${task.name}</a></div>
		    	<div class="details-container">
     	     		<div><a href="javascript:editTaskDescription()">${task.description}</a></div>			  
					<p>開始日-終了日: ${start_date} - ${end_date}</p>
					<p><a href="javascript:editTaskProgress()">進捗率: ${task.progress}%</a></p>
					<div><a href="javascript:insertTask()">下に行を挿入</a></div>
					<div><a href="javascript:deleteTask()">削除</a></div>
				</div>
			`;
		},
    });
	return obj;
  };
  var gantt = createGantt();
  gantt.modified = false;

  // ファイル入力処理
  var form = document.forms.myform;
   form.myfile.addEventListener( 'change', function(e) {
 	  //読み込んだファイル情報を取得
	  var result = e.target.files;
      // ファイルを読み込む
      var reader = new FileReader();
      reader.readAsText(result[0]);
      // ファイルが読み込まれた後の処理
      reader.addEventListener('load', function() {
		//var data = JSON.parse(reader.result);
		var data = eval('('+reader.result+')');
		tasks = data
		gantt.refresh(tasks)
      })	   
  })

  // メニューから呼び出される関数を定義
  window.viewMonth = function() {gantt.change_view_mode('Month');}
  window.viewWeek = function() {gantt.change_view_mode('Week');}
  window.viewDay = function() {gantt.change_view_mode('Day');}
  window.openFile = function() {console.log('openFile');}
  window.saveFile = function() {
	  var json = JSON.stringify(tasks);
	  console.log(json);
  }
  window.saveFileAs = function() {
    //ファイルを作ってダウンロードします。
	var resultJson = JSON.stringify(tasks, null, 2);
	var downLoadLink = document.createElement("a");
	downLoadLink.download = "download.json";
	downLoadLink.href = URL.createObjectURL(new Blob([resultJson], {type: "text.plain"}));
	downLoadLink.dataset.downloadurl = ["text/plain", downLoadLink.download, downLoadLink.href].join(":");
	downLoadLink.click();	  
  }
  window.insertTask = function() {
	var pos = tasks.indexOf(currentTask, 0);
	var newTask = {
		name: "Task", description:'', start: currentTask._start, end: currentTask._end,
		progress: 0
	};
	tasks.splice(pos+1, 0, newTask);
	gantt.refresh(tasks);
  }
  window.deleteTask = function() {
	var pos = tasks.indexOf(currentTask, 0);
	tasks.splice(pos, 1);
	gantt.refresh(tasks);
  }
  window.editTaskName = function() {
	var name = prompt('タスク名', currentTask.name);
	currentTask.name = name;
	gantt.refresh(tasks);
  }
  window.editTaskDescription = function() {
	var description = prompt('タスク内容', currentTask.description);
	currentTask.description = description;
	gantt.refresh(tasks);
  }
  window.editTaskProgress = function() {
	var value = prompt('進捗率', currentTask.progress);
	currentTask.progress = value;
	gantt.refresh(tasks);
  }
};
