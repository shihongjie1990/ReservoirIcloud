1、首先在本地创建ssh key；
$ ssh-keygen -t rsa -C "your_email@youremail.com"  
后面的your_email@youremail.com改为你的邮箱，之后会要求确认路径和输入密码，我们这使用默认的一路回车就行。成功的话会在~/下生成.ssh文件夹，进去，打开id_rsa.pub，复制里面的key。ls -al ~/.ssh检查   clip < ~/.ssh/id_rsa.pub复制
2、回到github，进入Account Settings，左边选择SSH Keys，Add SSH Key,title随便填，粘贴key。为了验证是否成功，在Git bash下输入：
$ ssh -T Git@github.com  
如果是第一次的会提示是否continue，输入yes就会看到：You’ve successfully authenticated, but GitHub does not provide shell access 。这就表示已成功连上github。
3、接下来我们要做的就是把本地仓库传到github上去，在此之前还需要设置username和email，因为github每次commit都会记录他们。
$ git config --global user.name "your name"  
$ git config --global user.email "your_email@youremail.com"  
进入要上传的仓库，右键git bash，添加远程地址：
$ git remote add origin git@github.com:yourName/yourRepo.git  (可以去git上复制仓库的地址)
4.提交、上传

接下来在本地仓库里添加一些文件，比如README，
$ git add README  
$ git commit -m "first commit" 
上传到github：
$ git push origin master  
git push命令会将本地仓库推送到远程服务器。
git pull命令则相反。


git clone的时候自动加载了fetch和push的主机地址，可以通过git remote -v来查看。

$ ssh -T git@github.com 

$ git pull origin master
$ git push origin master

$ git remote -v //远程主机地址


$ git remote add origin git@github.com:defnngj/hibernate-demo.git  //添加远程主机。


$ git config --list查看全局配置属性
