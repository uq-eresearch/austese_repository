<?xml version="1.0" encoding="utf-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html" encoding="utf-8"/>
<xsl:key name="respKey" match="//respStmt" use="@xml:id"/>
<xsl:template match="/">
<html><body>
<div class="transcript">
<xsl:apply-templates/>
</div>
<div style="display:none" class="facsimile">
<xsl:apply-templates select="//pb[@facs]" mode="facs"/>
</div>
</body></html>
</xsl:template>

<xsl:template match="//teiHeader">
</xsl:template>

<xsl:template match="TEI//text()">
	<xsl:choose>
		<xsl:when test="contains(., '[') and contains(substring-after(., '['), ']')">
			<xsl:value-of select="substring-before(., '[')"/>
			<xsl:call-template name="check-for-corrections">
		        <xsl:with-param name="string" select="substring-after(., ']')" />
		    </xsl:call-template>
    	</xsl:when>
    	<xsl:otherwise>
			<xsl:value-of select="."/>
    	</xsl:otherwise>
    </xsl:choose>
</xsl:template>


<xsl:template name="check-for-corrections">
    <xsl:param name="string" />
	<xsl:choose>
		<xsl:when test="contains($string, '[') and contains(substring-after($string,'['),']')">
			<xsl:value-of select="substring-before($string,'[')"/>
			<xsl:call-template name="check-for-corrections">
		        <xsl:with-param name="string" select="substring-after($string, ']')" />
		    </xsl:call-template>
    	</xsl:when>
    	<xsl:otherwise>
			<xsl:value-of select="$string"/>
    	</xsl:otherwise>
    </xsl:choose>
</xsl:template>

<xsl:template match="//empty">
<p class="large">NO TEXT</p>
</xsl:template>

<xsl:template match="//sp/stage">
<span class="stageitalic"><xsl:apply-templates/></span>
</xsl:template>

<xsl:template match="//sp/speaker">
<span class="speaker"><xsl:apply-templates/> </span>
</xsl:template>

<xsl:template match="//sp">
<p class="sp"><xsl:apply-templates/></p>
</xsl:template>

<xsl:template match="//l">
<xsl:if test="not(@type = 'half')">
	<span style="color:grey; width: 2em;" class="l" annotator_ignore="true" unselectable="on">
    	<xsl:value-of select="count(preceding::l[not(@type='half')])+1" />
		<xsl:text>&#xA0;&#xA0;</xsl:text>    
	</span>
</xsl:if>
<xsl:if test="@type='half'">
<span class="half">&#160;</span>
</xsl:if>
<xsl:if test="@rend='indent1'">
<xsl:text>&#xA0;&#xA0;&#xA0;</xsl:text>
</xsl:if>
<xsl:if test="@rend='indent2'">
<xsl:text>&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;</xsl:text>
</xsl:if>
<xsl:if test="@rend='indent3'">
<xsl:text>&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;</xsl:text>
</xsl:if>
<xsl:apply-templates/><br/>
</xsl:template>

<xsl:template match="lb">
<br class="lb"/><xsl:apply-templates/>
</xsl:template>

<xsl:template match="pb">
<span style="margin-top: 1em; display: block" class="pb" annotator_ignore="true" unselectable="on">
    <xsl:if test="@n">
        <xsl:attribute name="data-n">
        	<xsl:call-template name="check-for-corrections">
		    	<xsl:with-param name="string" select="@n" />
			</xsl:call-template>
		</xsl:attribute>
        <xsl:call-template name="check-for-corrections">
		    <xsl:with-param name="string" select="@n" />
		</xsl:call-template>
    </xsl:if>
</span>
<xsl:apply-templates/>
</xsl:template>

<xsl:template match="pb" mode="facs">
    <img data-src="{@facs}"/>
</xsl:template>

<xsl:template match="//handNote">
<!-- display nothing -->
</xsl:template>

<xsl:template match="//dateline">
<span class="dateline"><xsl:apply-templates/></span>
</xsl:template>


<xsl:template match="//head">
<h3 id="{generate-id()}" style="text-align: center"><xsl:apply-templates/></h3>
</xsl:template>

<xsl:template match="//head[@type='dedication']">
<h3 id="{generate-id()}" class="dedication" style="text-align: center"><xsl:apply-templates/></h3>
</xsl:template>

<xsl:template match="//head[@type='number']">
<h3 id="{generate-id()}" class="number" style="text-align: center"><xsl:apply-templates/></h3>
</xsl:template>

<xsl:template match="//head[@type='parthead']">
<h3 id="{generate-id()}" class="parthead" style="text-align: center"><xsl:apply-templates/></h3>
</xsl:template>

<xsl:template match="//head[@type='sig']">
<h3 id="{generate-id()}" class="sig" style="text-align: center"><xsl:apply-templates/></h3>
</xsl:template>

<xsl:template match="//head[@type='subtitle-sig']">
<h3 id="{generate-id()}" class="subtitle-sig" style="text-align: center"><xsl:apply-templates/></h3>
</xsl:template>

<xsl:template match="//head[@type='title-sig']">
<h3 id="{generate-id()}" class="title-sig" style="text-align: center"><xsl:apply-templates/></h3>
</xsl:template>

<xsl:template match="//div[@type='chapter']">
<div class="chapter"><xsl:apply-templates/></div>
</xsl:template>

<xsl:template match="//div[@type='colophon']">
<div class="colophon"><xsl:apply-templates/></div>
</xsl:template>

<xsl:template match="//div[@type='drama']">
<div class="drama"><xsl:apply-templates/></div>
</xsl:template>

<xsl:template match="//div[@type='dramapart']">
<div class="dramapart"><xsl:apply-templates/></div>
</xsl:template>

<xsl:template match="//div[@type='ednote']">
<div class="ednote"><xsl:apply-templates/></div>
</xsl:template>

<xsl:template match="//div[@type='epigraph']">
<div class="epigraph"><xsl:apply-templates/></div>
</xsl:template>

<xsl:template match="//div[@type='fragment']">
<div class="fragment"><xsl:apply-templates/></div>
</xsl:template>

<xsl:template match="//div[@type='Hnote']">
<div class="Hnote"><xsl:apply-templates/></div>
</xsl:template>

<xsl:template match="//div[@type='Hversion']">
<span>
<xsl:if test=".//head[@type='title']">
	<h3 id="{generate-id()}" class="title" style="text-align: center">
	<xsl:value-of select="translate(.//head[@type='title'], 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')" />
	</h3>
</xsl:if>
<xsl:if test=".//head[@type='subtitle']">
	<h4 id="{generate-id()}" class="title" style="text-align: center">
	<xsl:value-of select="translate(.//head[@type='subtitle'], 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')" />
	</h4>
</xsl:if>
<xsl:if test="./div[@type='source']">
	<div class="source" style="text-align: center">
	<xsl:apply-templates select="div[@type='source']/*"/>
	</div>
</xsl:if>
<xsl:if test="./div[@type='columnhead']">
	<div class="columnhead" style="text-align: center">
	<xsl:apply-templates select="div[@type='columnhead']/*"/>
	</div>
</xsl:if>
<xsl:if test="./div[@type='series']">
	<div class="series" style="text-align: center">
	<xsl:apply-templates select="div[@type='series']/*"/>
	</div>
</xsl:if>
<xsl:for-each select="./note">
    <!--span>
		<xsl:attribute name="class">
		<xsl:text>note</xsl:text>
		<xsl:if test="@type">
	          <xsl:text> </xsl:text><xsl:value-of select="@type"/>
		</xsl:if>
		</xsl:attribute>
		<xsl:if test="contains(@target,'#match(xpath1(id')">
		  <xsl:attribute name="data-target">
		      <xsl:value-of select='translate(substring-before(substring-after(@target,"id("),")"),&quot;&apos;&quot;,"")'/>
		  </xsl:attribute>
		  <xsl:attribute name="data-match">
		      <xsl:value-of select='translate(substring-before(substring-after(@target,"),"),")"),&quot;&apos;&quot;,"")'/>
		  </xsl:attribute>
		</xsl:if>
        <span class="note-content">
	<xsl:apply-templates/>
        </span>
	<xsl:if test="@resp">
                <xsl:variable name="author" select="substring-after(@resp,'#')"/>
        	<span class="note-author">
		<xsl:value-of select="key('respKey',$author)/name"/>
        	</span>
	</xsl:if>
    </span-->
</xsl:for-each>
<xsl:if test="./div[@type='sequence']">
	<div class="sequence">
	<xsl:apply-templates select="div[@type='sequence']/*"/>
	</div>
</xsl:if>
<div id="{generate-id()}" class="title" style="text-align: center"><xsl:value-of select="@xml:id"/></div>
<xsl:apply-templates/>
</span>
</xsl:template>

<xsl:template match="//head[@type='title']">
</xsl:template>

<xsl:template match="//head[@type='subtitle']">
</xsl:template>

<xsl:template match="//div[@type='source']">
</xsl:template>

<xsl:template match="//div[@type='columnhead']">
</xsl:template>

<xsl:template match="//div[@type='series']">
</xsl:template>

<xsl:template match="//div[@type='sequence']">
</xsl:template>

<xsl:template match="//div[@type='letter']">
<div class="letter"><xsl:apply-templates/></div>
</xsl:template>

<xsl:template match="//div[@type='MJSnote']">
</xsl:template>

<xsl:template match="//div[@type='poem']">
<div class="poem"><xsl:apply-templates/></div>
</xsl:template>

<xsl:template match="//div[@type='poempart']">
<div class="poempart"><xsl:apply-templates/></div>
</xsl:template>

<xsl:template match="//div[@type='titlepage']">
<div class="titlepage"><xsl:apply-templates/></div>
</xsl:template>

<!-- milestones -->
<xsl:template match="//ms">
<ms>
<xsl:attribute name="n"><xsl:value-of select="@n"/></xsl:attribute>
<xsl:if test="@l">
<xsl:attribute name="l"><xsl:value-of select="@l"/></xsl:attribute>
</xsl:if>
</ms>
</xsl:template>

<xsl:template match="//milestone[@unit='ornament']">
<span><xsl:value-of select="@rend" /></span>
</xsl:template>

<!-- chunks -->
<xsl:template match="//ch[@type='found']">
<span class="selected"><xsl:attribute name="id"><xsl:value-of select="@selid"/></xsl:attribute><xsl:apply-templates/></span>
</xsl:template>

<xsl:template match="//ch[@type='deleted']">
<span class="deleted"><xsl:apply-templates/></span>
</xsl:template>

<xsl:template match="//ch[@type='added']">
<span class="added"><xsl:apply-templates/></span>
</xsl:template>

<xsl:template match="//ch[@type='found,deleted']">
<span class="founddeleted" id="selection1"><xsl:apply-templates/></span>
</xsl:template>

<xsl:template match="//ch[@type='merged']">
<xsl:choose>
	<xsl:when test="@id">
	<span><xsl:attribute name="id"><xsl:value-of select="@id"/></xsl:attribute><xsl:apply-templates/></span>
	</xsl:when>
	<xsl:otherwise>
	<xsl:apply-templates/>
	</xsl:otherwise>
</xsl:choose>
</xsl:template>

<xsl:template match="//ch[@type='found,added']">
<span class="foundadded" id="selection1"><xsl:apply-templates/></span>
</xsl:template>

<xsl:template match="//ch[@type='parent']">
	<xsl:call-template name="wrapSpan">
		<xsl:with-param name="thisSide">left</xsl:with-param>
		<xsl:with-param name="thatSide">right</xsl:with-param>
		<xsl:with-param name="class">transposed</xsl:with-param>
	</xsl:call-template>
</xsl:template>

<xsl:template match="//ch[@type='child']">
	<xsl:call-template name="wrapSpan">
		<xsl:with-param name="thisSide">left</xsl:with-param>
		<xsl:with-param name="thatSide">right</xsl:with-param>
		<xsl:with-param name="class">transposed</xsl:with-param>
	</xsl:call-template>
</xsl:template>

<xsl:template name="wrapSpan">
	<xsl:param name="thisSide"/>
	<xsl:param name="thatSide"/>
	<xsl:param name="class" select="none"/>
	<xsl:variable name="iden" select="@id"/>
	<span>
	<xsl:attribute name="id">
		<xsl:value-of select="concat($thisSide,$iden)"/>
	</xsl:attribute>
	<xsl:if test="$class!='none'">
		<xsl:attribute name="class">
			<xsl:value-of select="$class"/>
		</xsl:attribute>
	</xsl:if>
	<!--xsl:attribute name="onclick">
		<xsl:value-of select="concat('javascript:performlink(','&quot;',$thisSide,$iden,'&quot;,','&quot;',$thatSide,$iden,'&quot;)')"/>
	</xsl:attribute-->
	<xsl:apply-templates/>
	</span>
</xsl:template>

<xsl:template match="//sp/p">
<span class="sp"><xsl:apply-templates/></span>
</xsl:template>

<xsl:template match="quote">
<span class="quote"><xsl:apply-templates/></span>
</xsl:template>

<xsl:template match="q">
<span class="q"><xsl:apply-templates/></span>
</xsl:template>

<xsl:template match="pc">
 <span>
   <xsl:attribute name="class">
   <xsl:text>pc</xsl:text>
   <xsl:if test="@type"><xsl:text> </xsl:text><xsl:value-of select="@type"/></xsl:if>
   </xsl:attribute>
   <xsl:apply-templates/>
 </span>
</xsl:template>

<xsl:template match="said">
	<span class="said">
	   <!--xsl:variable name="presquote" select="'pre(&#8216;)'"/>
	   <xsl:if test="contains(@rend,$presquote)">&#8216;</xsl:if>
	   <xsl:variable name="postsquote" select="'post(&#8217;)'"/>
	   <xsl:if test="contains(@rend,$postsquote)">&#8217;</xsl:if-->

	   <xsl:if test="@rend">&#8216;</xsl:if>
	   <xsl:apply-templates/>
	   <xsl:if test="@rend">&#8217;</xsl:if>
	</span>
</xsl:template>

<xsl:template match="//lg">
<p class="lg"><xsl:apply-templates/></p>
</xsl:template>

<xsl:template match="//emph">
<em style="font-style: italic;"><xsl:apply-templates/></em>
</xsl:template>

<xsl:template match="//emph[@rend='it']">
<em><xsl:apply-templates/></em>
</xsl:template>

<xsl:template match="//emph[@rend='ul']">
<em style="text-decoration:underline;"><xsl:apply-templates/></em>
</xsl:template>

<xsl:template match="//hi">
<span style="font-style: italic;"><xsl:apply-templates/></span>
</xsl:template>

<xsl:template match="//hi[@rend='italic']">
<em><xsl:apply-templates/></em>
</xsl:template>

<xsl:template match="//hi[@rend='b']">
<b><xsl:apply-templates/></b>
</xsl:template>

<xsl:template match="//hi[@rend='bi']">
<b style="font-style: italic;"><xsl:apply-templates/></b>
</xsl:template>

<xsl:template match="//hi[@rend='bl']">
<span style="font-family: Old English Text MT;"><xsl:apply-templates/></span>
</xsl:template>

<xsl:template match="//hi[@rend='dul']">
<span style="text-decoration:underline; border-bottom: 1px solid #000;"><xsl:apply-templates/></span>
</xsl:template>

<xsl:template match="//hi[@rend='graphic']">
<span style="font-family: Edwardian Script ITC;"><xsl:apply-templates/></span>
</xsl:template>

<xsl:template match="//hi[@rend='it']">
<span style="font-style: italic;"><xsl:apply-templates/></span>
</xsl:template>

<xsl:template match="//hi[@rend='sc']">
<span style="font-variant:small-caps;"><xsl:apply-templates/></span>
</xsl:template>

<xsl:template match="//hi[@rend='ss']">
<span style="vertical-align: super; font-size: smaller;"><xsl:apply-templates/></span>
</xsl:template>

<xsl:template match="//hi[@rend='ul']">
<span style="text-decoration:underline;"><xsl:apply-templates/></span>
</xsl:template>

<xsl:template match="//stage">
<p>
<xsl:choose>
<xsl:when test="@rend='italic'">
<xsl:attribute name="class">stageitalic</xsl:attribute>
</xsl:when>
<xsl:otherwise>
<xsl:attribute name="class">stage</xsl:attribute>
</xsl:otherwise>
</xsl:choose>
<xsl:apply-templates/></p>
</xsl:template>

<xsl:template match="//role">
<span class="role"><xsl:apply-templates/></span>
</xsl:template>

<xsl:template match="//castList">
<p class="cast"><b>Attori: </b><xsl:apply-templates/></p>
</xsl:template>


<xsl:template match="bibl/title">
    <h1 align="center">
        <xsl:apply-templates/>
    </h1>
</xsl:template>

<xsl:template match="bibl/author">
    <h2 align="center">
        <xsl:apply-templates/>
    </h2>
</xsl:template>

<xsl:template match="floatingText/body/p">
	<div>
  		<xsl:attribute name="class">
        	<xsl:value-of select="../../@type"/>
  		</xsl:attribute>
		<xsl:apply-templates/>
	</div>
</xsl:template>

<xsl:template match="gap">
</xsl:template>

<xsl:template match="unclear">
</xsl:template>

<xsl:template match="postscript">
<span class="postscript"><xsl:apply-templates/></span>
</xsl:template>

<xsl:template match="ref">
<span class="ref"><xsl:apply-templates/></span>
</xsl:template>

<xsl:template match="signed">
<span style="display: block; text-align: right" class="signed"><xsl:apply-templates/></span>
</xsl:template>

<xsl:template match="trailer">
<span class="trailer"><xsl:apply-templates/></span>
</xsl:template>

<xsl:template match="p | epigraph">
    <p>
	    <xsl:attribute name="id">
		    <xsl:choose>
		        <xsl:when test="@id">
		            <xsl:value-of select="@id"/>
		        </xsl:when>
		        <xsl:otherwise>
		            <xsl:value-of select="generate-id()"/>
		        </xsl:otherwise>
		    </xsl:choose>
	    </xsl:attribute>
	    <xsl:if test="contains(@rend,'text-indent')">
	       <xsl:attribute name="style">
	           <xsl:value-of select="@rend"/>
	       </xsl:attribute>
	    </xsl:if>
	    <xsl:if test="../@type = 'prose'">
			<xsl:text>&#xA0;&#xA0;&#xA0;</xsl:text>
		</xsl:if>
        <xsl:apply-templates/>
    </p>
</xsl:template>

<xsl:template match="note">

</xsl:template>

<xsl:template match="add">
    <span class="foundadded">
	<xsl:attribute name="class">
	<xsl:text>foundadded</xsl:text>
	   <xsl:choose>
        <xsl:when test="@place"><xsl:text> foundadded-</xsl:text><xsl:value-of select="@place"/></xsl:when>
        <xsl:otherwise><xsl:text> foundadded-default</xsl:text></xsl:otherwise>
       </xsl:choose>
	</xsl:attribute>
	 <xsl:apply-templates/>
    </span>
</xsl:template>

<xsl:template match="del">
    <xsl:choose>
        <xsl:when test="@rend='overstrike'">
           <span class="founddeleted overstrike">
              <xsl:apply-templates/>
           </span>
        </xsl:when>
        <xsl:otherwise>
           <span class="founddeleted founddeleted-default">
                <xsl:apply-templates/>
            </span>
        </xsl:otherwise>
    </xsl:choose>
</xsl:template>

<xsl:template match="div2">
    <h3>
        <xsl:value-of select="@id"/>
    </h3>
    <xsl:apply-templates/>
</xsl:template>

</xsl:stylesheet>