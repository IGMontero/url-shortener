$('#shortener').on('click',function(){
  var url = $('#url-field').val();
  
  if(!url)
    return;
  
  $.ajax({
    url:'api/shorten',
    type:'POST',
    dataType:'json',
    data:{url:url},
    success: function(data){
      if(data.error){
        $('#error-message').text(data.error);
        $('#url-response').hide();
        $('#error-message').show();
      }else{
        $('#response label').css('visibility',"visible");
        $("#error-message").hide();
        $('#url-response').show();
        $('#long-url').html("<a id=\"long-url\" href=\""+data.long_url+"\">"+data.long_url+"</a>");
        $('#short-url').html("<a id=\"short-url\" href=\""+data.short_url+"\">"+data.short_url+"</a>");
      }
    }
  })
  
  
})